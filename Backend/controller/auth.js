const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { sendMail } = require("../services/resend.js")
const TempUser = require("../models/tempUser.js");
const { OAuth2Client } = require("google-auth-library");
const { sendWelcomeMail } = require("../services/welcomeMail.js");
const { redis } = require("../config/redis.js");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
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
        try {
            await sendMail({
                to: email,
                subject: "OTP",
                html: `<div><h1>Your OTP is ${otp}</h1></div>`,
            });

        } catch (err) {
            console.log("Failed to send OTP", err.message)
            await redis.del(SIGNUP_USER_KEY);
            return res.status(500).json({ message: "Failed to send OTP" });
        }

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
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        await redis.del(SIGNUP_USER_KEY);
        await redis.del(OTP_ATTEMPTS_KEY);
        await redis.del(`otp-resend:${email}`);
        await sendWelcomeMail(newUser)
        res.status(200).json({
            message: "Account created successfully",
            user: newUser,
            token,
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


        await redis.del(ATTEMPT_KEY);
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.status(200).json({ user, token })
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



        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            message: "Login successful",
            user: { email, name },
            token: jwtToken,
        });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(400).json({ message: "Invalid Google token" });
    }
};

const fetchUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token" });

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

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

module.exports = { sendOtp, verifyOtp, login, googleLogin, fetchUser, address }



