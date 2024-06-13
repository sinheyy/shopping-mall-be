const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

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

authController.loginWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        // token 값 해석하기
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        })
        const { email, name } = ticket.getPayload();
        // console.log("eeeeeeeeeeee", email, name);

        let user = await User.findOne({ email });
        if (!user) {
            // 유저를 새로 생성 - password는 받지 않기 때문에 랜덤으로 지정해서 넣어두기
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = "";
            for (let i = 0; i < Math.random() * 20; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            const randomPassword = "" + result + Math.floor(Math.random() * 99999999);
            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(randomPassword, salt);
            user = new User({
                name,
                email,
                password: newPassword
            })
            await user.save();
        }

        // token 발행 및 리턴
        const sessionToken = await user.generateToken();
        res.status(200).json({ status: "success", user, token: sessionToken });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

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

authController.checkAdminPermission = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);

        if (user.level == "admin") {
            next();
        }
        else {
            throw new Error("no permission");
        }
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

module.exports = authController;