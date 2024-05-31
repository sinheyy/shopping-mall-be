const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require("./routes/index");
const app = express();

require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());     // req.body가 객체로 인식이 됨

app.use("/api", indexRouter);
// /api/user가 들어오면 indexRouter로 가고 index.js에서 보면 /user는 userApi로 감

const mongoURI = process.env.SERVER_DB_ADDRESS;
mongoose
    .connect(mongoURI)
    .then(() => console.log("mongoose connected"))
    .catch((err) => console.log("DB connection fail", err));

app.listen(process.env.PORT || 5000, ()=>{
    console.log("server on");
});

