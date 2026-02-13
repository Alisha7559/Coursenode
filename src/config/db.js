const mongoose = require("mongoose");

require('dotenv').config();
 const dbURI = process.env.DB_URI;
    console.log(dbURI);


const connectDB = async()=>{
    await mongoose.connect(dbURI)

   
}
connectDB()
.then (() =>{
    console.log("db connected successfully")})
.catch (() =>{
    console.log("db  not connected ");
});
