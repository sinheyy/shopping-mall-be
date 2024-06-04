const Product = require("../models/Product");

const PAGE_SIZE = 8;
const productController = {};

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
        const cond = name ? { name: { $regex: name, $options: "i" } } : {};
        let query = Product.find(cond);
        let response = { status: "success" };       // 동적으로 response
        if (page) {
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);   // skip하고 싶은 데이터 값을 스킵, limit은 document를 리턴할 최대 개수
            // 최종 몇 개 페이지 - 데이터 총 개수 / PAGE_SIZE
            const totaItemNum = await Product.find(cond).count();
            const totalPageNum = Math.ceil(totaItemNum / PAGE_SIZE);

            response.totalPageNum = totalPageNum;
        }
        const productList = await query.exec();
        response.data = productList;
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;    // 수정하고싶은 id
        const { sku, brand, name, option, image, category, description, price, salePrice, stock, status, choice, isNew, detail } = req.body;

        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            { sku, brand, name, option, image, category, description, price, salePrice, stock, status, choice, isNew, detail },
            { new: true }
        );

        if (!product) throw new Error("상품이 존재하지 않습니다.");
        res.status(200).json({ status: "success", data: product });

    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = productController;