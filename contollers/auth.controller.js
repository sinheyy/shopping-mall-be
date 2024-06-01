const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
}

module.exports = authController;