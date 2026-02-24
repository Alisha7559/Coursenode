const express=require("express")
const router=express.Router();
const categorycontroller=require("../controllers/categorycontroller")
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");


router.post("/category", auth,upload.single("image"), categorycontroller.createCategory);

router.get("/categories", categorycontroller.getAllCategories);
module.exports =router