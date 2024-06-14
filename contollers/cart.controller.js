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

cartController.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;   // 삭제하고 싶은 ID
        const { userId } = req;
        const cart = await Cart.findOne({ userId });
        cart.items = cart.items.filter((item) => !item._id.equals(id));
        await cart.save();

        res.status(200).json({ status: "success", qty: cart.items.length });
    }
    catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

cartController.editCartItem = async (req, res) => {
    try {
        const { id } = req.params;   // 수정하고 싶은 ID
        const { userId } = req;
        const { qty } = req.body;
        const cart = await Cart.findOne({ userId }).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product"
            }
        });

        if (cart){
            const index = cart.items.findIndex((item) => item._id.equals(id));
            if (index === -1) throw new Error("상품을 찾을 수 없습니다.");
            cart.items[index].qty = qty;
            await cart.save();
            res.status(200).json({ status: "success", data: cart.items });
        }
        else{
            throw new Error("no cart for this user");
        }
        
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

cartController.getCartQty = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({ userId: userId });
        if (cart) {
            res.status(200).json({ status: "success", qty: cart.items.length });
        }
        else {
            throw new Error("카트가 없습니다.");
        }

    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = cartController;