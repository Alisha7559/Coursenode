// const express = require("express");
// const router = express.Router();
// const orderController = require("../controllers/ordercontroller");
// const auth = require("../middleware/auth"); 
// router.post("/createorder", auth, orderController.createOrder);
// router.get("/getinstiorder/:id", orderController.getInstitutionOrders);

// router.get("/getallorder", orderController.getAllOrders);
// router.get("/getsingleorder/:id", orderController.getSingleOrder);
// router.put("/updateorder/:id", orderController.updateOrder);

// module.exports = router;
const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const orderController = require("../controllers/ordercontroller");


// ✅ protect route
router.post("/createorder", auth, orderController.createOrder);

router.get("/getinstiorder/:id", auth, orderController.getInstitutionOrders);

router.get("/getorders", auth, orderController.getAllOrders);

router.put("/updateorder/:id", auth, orderController.updateOrder);


module.exports = router;
