const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const { sendMail } = require("../services/nodemail.js")
const TempUser = require("../models/tempUser.js");
const { OAuth2Client } = require("google-auth-library");
const { sendWelcomeMail } = require("../services/welcomeMail.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const sendOtp = async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const tempUser = await TempUser.findOne({ email });
        if (tempUser) {
            const lastSent = new Date(tempUser.updatedAt).getTime()
            const now = Date.now()
            if (now - lastSent < 60000) return res.status(429).json({ message: "Please try again in 1 minute" })
        }

        await TempUser.findOneAndUpdate(
            { email },
            {
                email,
                name,
                password: hashedPassword,
                otp,
                expiresAt: Date.now() + 10 * 60 * 1000,
            },
            {
                upsert: true,
                new: true,
            }
        );

        await sendMail({
            to: email,
            subject: "OTP",
            html: `<div><h1>Your OTP is ${otp}</h1></div>`,
        });

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (err) {
        (err);
        res.status(500).json({ message: err.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    ("email", email, "otp", otp);

    try {

        const temp = await TempUser.findOne({ email });
        ("temp", temp);
        if (!temp) {
            return res.status(404).json({ message: "No OTP request found" });
        }
        if (temp.expiresAt < Date.now()) {
            await TempUser.deleteOne({ email });
            return res.status(400).json({ message: "OTP expired" });
        }

        if (temp.otp !== otp) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        const newUser = await User.create({
            name: temp.name,
            email: temp.email,
            password: temp.password,
        });

        await TempUser.deleteOne({ email });
        await sendWelcomeMail(newUser)
        res.status(200).json({
            message: "Account created successfully",
            user: newUser,
        });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "Invalid Email or Password" })
        }
        if (!user || user.provider === "google") {
            return res.status(400).json({ message: "Use Google login" });
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }

        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.status(201).json({ user, token })
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
        const authHeader = req.headers.authorization; // "Bearer <token>"
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



