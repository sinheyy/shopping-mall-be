const express = require("express");
const authController = require("../contollers/auth.controller");
const orderController = require("../contollers/order.controller");
const router = express.Router();

router.post("/", authController.authenticate, orderController.createOrder);

router.get("/me", authController.authenticate, orderController.getOrder);

router.get("/", authController.authenticate, orderController.getOrderList);

router.put("/:id",
    authController.authenticate,
    authController.checkAdminPermission,
    orderController.updateOrder
);

module.exports = router;