const Order = require("../models/Order");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const productController = require("./product.controller");

const orderController = {};

orderController.createOrder = async (req, res) => {
    try {
        // front에서 data 보낸 거 받아오기
        // data - userId, totalPrice, shipTo, contact, orderList
        const { userId } = req;
        const { shipTo, contact, totalPrice, orderList } = req.body;
        console.log(orderList);
        // product의 stock 확인하기 - 재고 확인 & 업데이트
        const insufficientStockItems = await productController.checkItemListStock(orderList);
        if (insufficientStockItems.length > 0) {
            // 재고가 충분하지 않은 아이템이 있었다 -> 에러
            const errorMessage = insufficientStockItems.reduce((total, item) => total += item.message, "");
            throw new Error(errorMessage);
        }
        else {
            // 재고가 다 충분함 -> 오더 만들기
            // 읽어온 걸 바탕으로 order 만들기
            const newOrder = new Order({
                userId,
                totalPrice,
                shipTo,
                contact,
                items: orderList,
                orderNum: randomStringGenerator()
            });

            await newOrder.save();
            res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
        }
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = orderController;