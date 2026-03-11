const express = require("express");

const router = express.Router();

const supportController = require("../controllers/supportController");
const auth = require("../middleware/auth");

/* ================= SUPPORT TYPE ================= */

router.post("/support-type", supportController.createSupportType);

router.get("/support-types", supportController.getSupportTypes);


/* ================= INSTITUTION SUPPORT ================= */

router.post("/support-request", auth, supportController.createSupportRequest);

router.get("/my-support-requests", auth, supportController.getMyRequests);


/* ================= ADMIN SUPPORT ================= */

router.get("/support-requests", supportController.getSupportRequests);

router.post("/support-reply/:id", supportController.replySupport);

router.delete("/support/:id", supportController.deleteSupport);


module.exports = router;