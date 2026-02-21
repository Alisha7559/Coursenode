const express=require("express")
const router=express.Router();
const categorycontroller=require("../controllers/categorycontroller")
const auth = require("../middleware/auth");

router.post("/category", auth, categorycontroller.createCategory);

router.get("/categories", categorycontroller.getAllCategories);
module.exports =router