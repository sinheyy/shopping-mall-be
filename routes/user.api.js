const express = require("express");
const userContoller = require("../contollers/user.controller");
const authController = require("../contollers/auth.controller");
const router = express.Router();

// 회원 가입
router.post("/", userContoller.createUser);
router.get("/me", authController.authenticate, userContoller.getUser);
// token은 헤더에 보냄 - token이 valid한지, 이 token 가지고 유저 찾아서 리턴


module.exports = router;