const express = require("express");
const userContoller = require("../contollers/user.controller");
const router = express.Router();

// 회원 가입
router.post("/", userContoller.createUser);

module.exports = router;