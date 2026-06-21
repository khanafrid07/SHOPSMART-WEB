const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { sendMail } = require("../services/resend.js")
const { OAuth2Client } = require("google-auth-library");
const { sendWelcomeMail } = require("../services/welcomeMail.js");
const { redis } = require("../config/redis.js");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const { emailQueue } = require("../queues/email.queue")


const generateToken = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}

const cookieOptions = {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
}

const sendOtp = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const user = await User.findOne({ email });
        const SIGNUP_USER_KEY = `user:${email}`;
        const RESEND_KEY = `otp-resend:${email}`;
        const cooldown = await redis.get(RESEND_KEY)

        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        if (cooldown) {
            return res.status(429).json({ message: "Too many requests. Retry after 60 seconds." })
        }

        const otp = Math.floor(10000 + Math.random() * 90000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const payload = {
            name,
            email,
            password: hashedPassword,
            otp,
            createdAt: Date.now(),
        }
        await redis.set(RESEND_KEY, 1, "EX", 60);


        await redis.set(SIGNUP_USER_KEY, JSON.stringify(payload), "EX", 600);

        await emailQueue.add("sendEmail", {
            to: email,
            subject: "OTP",
            html: `<div><h1>Your OTP is ${otp}</h1></div>`,
        },
            {
                backoff: { delay: 2000, type: "exponential" },
                attempts: 3,
                removeOnComplete: true,
                removeOnFail: true,
            }
        )

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (err) {
        (err);
        res.status(500).json({ message: err.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {

        const SIGNUP_USER_KEY = `user:${email}`
        const userData = await redis.get(SIGNUP_USER_KEY);
        const OTP_ATTEMPTS_KEY = `otp-attempts:${email}`

        if (!userData) {
            return res.status(404).json({
                message: "No OTP request found"
            });
        }

        const user = JSON.parse(userData);

        if (!user.otp) {
            return res.status(400).json({ message: "OTP has expired or invalid" })
        }



        if (String(user.otp) !== String(otp)) {
            const incremented = await redis.incr(OTP_ATTEMPTS_KEY);

            if (incremented === 1) {
                await redis.expire(OTP_ATTEMPTS_KEY, 60);
            }

            const attempts =
                Number(await redis.get(OTP_ATTEMPTS_KEY)) || 0;

            if (attempts >= 3) {
                const ttl = await redis.ttl(OTP_ATTEMPTS_KEY);

                return res.status(429).json({
                    message: `Too many attempts. Retry after ${ttl} seconds.`
                });
            }


            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            await redis.del(SIGNUP_USER_KEY);
            return res.status(409).json({
                message: "User already exists"
            });
        }



        const newUser = await User.create({
            name: user.name,
            email: user.email,
            password: user.password,
        });
        const { accessToken, refreshToken } = generateToken(newUser);
        await redis.set(`refresh:${newUser._id}`, refreshToken, "EX", 7 * 24 * 60 * 60);


        await redis.del(SIGNUP_USER_KEY);
        await redis.del(OTP_ATTEMPTS_KEY);
        await redis.del(`otp-resend:${email}`);

        await emailQueue.add("sendWelcomeMail", newUser)
        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({
            message: "Account created successfully",
            user: newUser,
            token: accessToken,
        });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    let { email, password } = req.body;
    try {
        const ATTEMPT_KEY = `login-attempts:${email}`
        const attempts =
            Number(await redis.get(ATTEMPT_KEY)) || 0;

        if (attempts >= 5) {
            const ttl = await redis.ttl(ATTEMPT_KEY);

            return res.status(429).json({
                message: `Too many attempts. Retry after ${ttl} seconds.`
            });
        }


        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }
        if (user.provider === "google") {
            return res.status(400).json({ message: "Use Google login" });
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            const newAttemmpts = await redis.incr(ATTEMPT_KEY);
            if (newAttemmpts === 1) {
                await redis.expire(ATTEMPT_KEY, 600);
            }
            return res.status(401).json({ message: `Invalid Email or Password` })
        }

        const { accessToken, refreshToken } = generateToken(user);
        await redis.set(`refresh:${user._id}`, refreshToken, "EX", 7 * 24 * 60 * 60);


        await redis.del(ATTEMPT_KEY);
        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user, token: accessToken })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
};

const googleLogin = async (req, res) => {

    const { token } = req.body;

    if (!token) return res.status(400).json({ message: "Token is required" });

    try {

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ name, email, provider: "google" });
            await sendWelcomeMail(user)
            await user.save();
        }

        const { accessToken, refreshToken } = generateToken(user);
        await redis.set(`refresh:${user._id}`, refreshToken, "EX", 7 * 24 * 60 * 60);

        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({
            message: "Login successful",
            user: { email, name },
            token: accessToken,
        });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(400).json({ message: "Invalid Google token" });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh Token not found" })
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedRefreshToken = await redis.get(`refresh:${decoded.id}`);
        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
        await redis.set(`refresh:${user._id}`, newRefreshToken, "EX", 7 * 24 * 60 * 60);
        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user, token: accessToken })
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

const fetchUser = async (req, res) => {
    try {
        let token = req.cookies?.accessToken;

        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {

        res.status(401).json({ message: "Invalid or expired token" });
    }
};

const forgotPasswordSendOtp = async (req, res) => {
    console.log("req rec")
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.provider === "google") {
            return res.status(400).json({ message: "User is logged in with google" });
        }
        const FORGOT_OTP_KEY = `forgot-otp:${user._id}`;
        const RESEND_KEY = `resend:${user._id}`;
        const cooldown = await redis.get(RESEND_KEY);
        const ttl = await redis.ttl(RESEND_KEY);
        if (cooldown) return res.status(400).json({ message: `Please wait ${ttl} seconds before resending OTP` });
        const otp = Math.floor(10000 + Math.random() * 90000);
        await redis.set(FORGOT_OTP_KEY, otp, "EX", 600);
        await redis.set(RESEND_KEY, 1, "EX", 60);
        await emailQueue.add("forgotPasswordOtpMail", { to: user.email, name: user.name, otp }, {
            backoff: {
                delay: 200,
                type: "exponential"
            },
            attempts: 3,
            removeOnComplete: true,
            removeOnFail: true
        })

        res.status(200).json({ message: "Otp sent successfully" })

    } catch (err) {
        res.status(500).json({ message: err.message })
        console.log(err)
    }
}

const forgotPasswordVerifyOtp = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        if (!email || !otp || !password) return res.status(400).json({ message: "Email, Otp and new password are required" })
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: "User not found" })
        if (user.provider === "google") {
            return res.status(400).json({ message: "User is logged in with google" });
        }
        const FORGOT_OTP_KEY = `forgot-otp:${user._id}`;
        const savedOtp = await redis.get(FORGOT_OTP_KEY);
        if (!savedOtp || String(savedOtp) !== String(otp)) {
            return res.status(401).json({ message: "Invalid or expired otp" });
        }
        const newPassword = await bcrypt.hash(password, 10)
        user.password = newPassword;
        await user.save();
        await redis.del(FORGOT_OTP_KEY);
        const { accessToken, refreshToken } = generateToken(user);
        await redis.set(`refresh:${user._id}`, refreshToken, "EX", 7 * 24 * 60 * 60);
        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: "Otp verified successfully" })
    } catch (err) {
        res.status(401).json({ message: err.message })
    }
}

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        
        const clearOptions = { 
            httpOnly: true, 
            sameSite: "strict", 
            secure: process.env.NODE_ENV === "production"
        };
        
        res.clearCookie("accessToken", clearOptions);
        res.clearCookie("refreshToken", clearOptions);
        
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                await redis.del(`refresh:${decoded.id}`);
            } catch (err) {
                // Ignore invalid tokens during logout
            }
        }
        
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const address = async (req, res) => {
    try {
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        (`${firstName} ${lastName}`)
        let user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "USer not found" })
        }

        user.addresses.push({ ...req.body, addressName: `${firstName} ${lastName}` })
        const newAddress = user.addresses[user.addresses.length - 1]
        await user.save()

        return res.status(201).json({ message: "ADress added successfully", address: newAddress })
    } catch (err) {
        return res.status(500).json({ message: "Internal Server error" })
    }

};

module.exports = { sendOtp, verifyOtp, login, googleLogin, fetchUser, address, refreshAccessToken, logout, forgotPasswordSendOtp, forgotPasswordVerifyOtp }



