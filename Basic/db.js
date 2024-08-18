const mongoose = require('mongoose');
require('dotenv').config();

// const mongodburl = "mongodb://127.0.0.1:27017/Hotels";
//onst mongodburl = process.env.DB_URL;
const mongodburl = process.env.DB_URL_LOCAL;


mongoose.connect(mongodburl);

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("database connected successfully!");
})

db.on("error",(err)=>{
    console.log("database connection failed!",err);
})

db.on("disconnected",(err)=>{
    console.log("database connection failed!",err);
})



module.exports = db;