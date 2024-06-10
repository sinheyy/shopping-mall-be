const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");
const Schema = mongoose.Schema;
const orderSchema = Schema({
    shipTo: { type: Object, required: true },
    status: { type: String, default: "상품준비중" },
    totalPrice: { type: Number, required: true, default: 0 },
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

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;