const Order = require("../models/Order");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const productController = require("./product.controller");

const PAGE_SIZE = 5;
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
            // 재고 수량 변경
            orderList.map(async (item) => await productController.updateStock(item));

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
            // save 후에 카트 비우기

            res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
        }
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

orderController.getOrder = async (req, res) => {
    try {
        const { userId } = req;

        // userId인 order 다 가져오기
        const orderList = await Order.find({ userId: userId }).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
            },
        });
        const totalItemNum = await Order.find({ userId: userId }).count();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        res.status(200).json({ status: "success", data: orderList, totalPageNum });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

orderController.getOrderList = async (req, res) => {
    try {
        const { page, ordernum } = req.query;

        let cond = {};
        if (ordernum) {
            cond = { orderNum: { $regex: ordernum, $options: "i" } }
        };

        const orderList = await Order.find(cond)
            .populate("userId")
            .populate({
                path: "items",
                populate: {
                    path: "productId",
                    model: "Product"
                }
            })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        const totalItemNum = await Order.find(cond).count();
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        res.status(200).json({ status: "success", data: orderList, totalPageNum });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

orderController.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );
        if (!order) throw new Error("주문 내역을 찾을 수 없습니다.");
        res.status(200).json({ status: "success", data: order });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = orderController;