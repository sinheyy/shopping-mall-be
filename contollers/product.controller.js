const Product = require("../models/Product");

const productController = {}

productController.createProduct = async (req, res) => {
    try {
        const { sku, brand, name, option, image, category, description, price, salePrice, stock, status, choice, isNew, detail } = req.body;
        const product = new Product({ sku, brand, name, option, image, category, description, price, salePrice, stock, status, choice, isNew, detail });

        await product.save();
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = productController;