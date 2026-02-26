const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
require("./src/config/db");

const studentRouter = require("./src/routes/studentRoutes");
const course = require("./src/routes/course");
const institution = require("./src/routes/instirouter");
const role = require("./src/routes/role");
const subcat = require("./src/routes/subcategory");
const adminRouter = require("./src/routes/adminRoutes");
const reviewRouter = require("./src/routes/reviewRoutes");
const orderRouter = require("./src/routes/oderRoutes");
const categoryRouter = require("./src/routes/categoryRoutes");
const feedbackRoutes = require("./src/routes/feedback");

const app = express();
const port = process.env.PORT || 7000;

// ✅ CORS for Cookies
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// ===== API ROUTES =====
app.use("/api/students", studentRouter);
app.use("/api", course);
app.use("/api", institution);
app.use("/api", role);
app.use("/api", subcat);
app.use("/api", adminRouter);
app.use("/api", reviewRouter);
app.use("/api", orderRouter);
app.use("/api", categoryRouter);
app.use("/api/feedback", feedbackRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});