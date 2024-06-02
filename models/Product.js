const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = Schema({
    sku: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    option: { type: Array, required: true },
    category: { type: Array, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    stock: { type: Object, required: true },
    status: { type: String, default: "active" },
    choice: { type: Boolean, required: true },
    isNew: { type: Boolean, required: true },
    detail: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// 해당 값을 빼고 리턴
productSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
}

const Product = mongoose.model("Product", productSchema);
module.exports = Product;