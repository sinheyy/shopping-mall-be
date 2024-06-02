const express = require('express');
const authController = require('../contollers/auth.controller');
const productController = require('../contollers/product.controller');
const router = express.Router();

router.post(
    "/",
    authController.authenticate,
    authController.checkAdminPermission,
    productController.createProduct
);

module.exports = router;