const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authController = {};

authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            // password 비교 - bcrypt가 compare 제공
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // token 만들어주기
                const token = await user.generateToken();
                return res.status(200).json({ status: "success", user, token });
            }
        }
        throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) throw new Error("Token not found");
        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if (error) throw new Error("invalid token");
            req.userId = payload._id;
        });
        next();
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = authController;