const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");
const Cart = require("./Cart");
const Schema = mongoose.Schema;
const orderSchema = Schema({
    shipTo: { type: Object, required: true },
    status: { type: String, default: "상품준비중" },
    totalPrice: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, required: true, default: 0 },
    contact: { type: Object, required: true },
    userId: { type: mongoose.ObjectId, ref: User },
    orderNum: { type: String },
    items: [{
        productId: { type: mongoose.ObjectId, ref: Product },
        option: { type: String, required: true },
        qty: { type: Number, default: 1, required: true },
        price: { type: Number, required: true },

    }]
}, { timestamps: true });

// 해당 값을 빼고 리턴
orderSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
}

// order가 save 되면 카트를 비워줌
orderSchema.post("save", async function () {
    //카트를 비워주자
    const cart = await Cart.findOne({ userId: this.userId });  // userId 기준으로 내 카트 찾기
    cart.items = [];
    await cart.save();
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;