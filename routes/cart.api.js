const express = require("express");
const authController = require("../contollers/auth.controller");
const cartController = require("../contollers/cart.controller");
const router = express.Router();

router.post("/", authController.authenticate, cartController.addItemToCart);
router.get("/", authController.authenticate, cartController.getCart);
router.delete("/:id", authController.authenticate, cartController.deleteCartItem);
router.put("/:id", authController.authenticate, cartController.editCartItem);

module.exports = router;