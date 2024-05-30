const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, default: "customer" }        // 2 types : customer, admin
}, { timestamps: true });

// 해당 값을 빼고 리턴
userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.__v;
    delete obj.updateAt;
    delete obj.createAt;
    return obj;
}

const User = mongoose.model("User", userSchema);
module.exports = USER;