const Cart = require("../models/Cart");

const cartController = {}

cartController.addItemToCart = async (req, res) => {
    try {
        const { userId } = req;
        const { productId, option, qty } = req.body;
        // 유저를 가지고 카트 찾기
        let cart = await Cart.findOne({ userId });
        // 만약 유저가 만든 카트가 없다면,
        if (!cart) {
            // 카트 새로 만들어주기
            cart = new Cart({ userId });
            await cart.save();
        }
        // 이미 카트에 들어가 있는 아이템이냐? productId, option도 고려하기
        const exsistItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.option === option);

        // 그렇다면 에러("이미 카트에 담긴 상품입니다.")
        if (exsistItem) throw new Error("이미 카트에 담긴 상품입니다.");

        // 새로운  정보를 가지고 카트에 아이템을 추가
        cart.items = [...cart.items, { productId, option, qty }];
        await cart.save()

        res.status(200).json({ status: "success", data: cart, cartItemQty: cart.items.length });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

cartController.getCart = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items',
            populate: {         // productId를 가지고 Product를 가져온다
                path: 'productId',
                model: 'Product',
            }
        });

        res.status(200).json({ status: "success", data: cart.items });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = cartController;