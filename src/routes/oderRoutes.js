const express = require("express");
const router = express.Router();
const orderController = require("../controllers/ordercontroller");

router.post("/createorder", orderController.createOrder);
router.get("/getinstiorder/:id", orderController.getInstitutionOrders);

router.get("/getallorder", orderController.getAllOrders);
router.get("/getsingleorder/:id", orderController.getSingleOrder);
router.put("/updateorder/:id", orderController.updateOrder);

module.exports = router;
