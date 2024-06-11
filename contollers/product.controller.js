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
        // isDeleted가 false인 것만 가져오기
        const cond = name ? { name: { $regex: name, $options: "i" }, isDeleted: false } : { isDeleted: false };
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

productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;   // 수정하고 싶은 ID
        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            { isDeleted: true }
        );
        if (!product) throw new Error("No item found");
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

productController.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) throw new Error("No item found");
        res.status(200).json({ status: "success", data: product });
    } catch {
        return res.status(400).json({ status: "fail", message: error.message });
    }
}

// 상품 하나에 대한 재고 확인
productController.checkStock = async (item) => {
    // 내가 사려는 제품 재고 정보 들고 오기
    const product = await Product.findById(item.productId);
    // console.log("product read", product);
    // console.log("stock read", product.stock);
    // console.log("m read", product.stock["m"]);

    // 내가 사려는 제품 qty와 재고 비교
    if (product.stock[item.option] < item.qty) {
        // 재고 부족하면 불충분 메세지와 함께 데이터 반환
        return { isVerify: false, message: `${product.name}의 "${item.option}" 재고가 부족합니다.` };
    }
    else {
        return { isVerify: true };
    }
}

// 상품 하나에 대한 재고 수량 변경 - 주문 생성 성공한 경우에만 
productController.updateStock = async (item) => {
    // 내가 사려는 제품 재고 정보 들고 오기
    const product = await Product.findById(item.productId);

    const newStock = { ...product.stock };
    newStock[item.option] -= item.qty;
    product.stock = newStock;
    await product.save();
}

// 상품 재고 확인
productController.checkItemListStock = async (itemList) => {
    console.log("itemList", itemList);
    const insufficientStockItems = [];

    // 재고 확인 로직 - Promise.all 하게 되면 병렬로 실행하게 된다
    await Promise.all(
        itemList.map(async (item) => {
            const stockCheck = await productController.checkStock(item);
            if (!stockCheck.isVerify) {
                // false 일 시
                insufficientStockItems.push({ item, message: stockCheck.message });
            }
            return stockCheck;
        })
    );


    return insufficientStockItems;
}

module.exports = productController;