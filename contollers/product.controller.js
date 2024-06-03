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

productController.getProducts = async (req, res) => {
    try {
        const { page, name } = req.query;
        // if (name) {
        //     const products = await Product.find({ name: { $regex: name, $options: "i" } });     // regex는 포함하는 거 보여주기 ,option i는 영어 대소문자 신경 안 씀
        // }
        // else {
        //     const products = await Product.find({});
        // }
        const cond = name ? { name: { $regex: name, $options: "i" }}:{};
        let query = Product.find(cond);
        const productList = await query.exec();
        res.status(200).json({ status: "success", data : productList });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = productController;