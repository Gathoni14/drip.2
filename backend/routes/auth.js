import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv"
import User from "./models/user";

dotenv.config();

const router = express.Router();

// register user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return
        res.status(400).json({ message: "Email already exists"});

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save new user 
        const newUser = await User.create({ name, email, password: hashedPassword});

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
});

//login user

router.post("/login", async (req, re) => {
    try {
        const { email, password } = req.body;

        //find user
        const user = await
        User.findone({
            email
        });
        if (!user) return 
            res.status(400).json({ message: "User not found" });

            // check password
            const valid = await 
            bcrypt.compare(password, user.password);
            if (!valid) return 
            res.status(400).json({ message: "Invalid password" });

            // create JWT
            const token = jwt.sign({ id: user._id }, 
                process.env.JWT_SECRET, { expiresIn: "7d" });

                res.json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user._id, name: user.name, email: user.email },
                    });
                } catch (err) {
                    res.status(500).json({ message: "Server error", error: err.message });
                }
            });

export default router;
