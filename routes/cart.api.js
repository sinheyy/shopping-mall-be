const express = require("express");
const authController = require("../contollers/auth.controller");
const authController = require("../contollers/cart.controller");
const router = express.Router();

router.post("/", authController.authenticate, cartController.addItemToCart);

module.exports = router;