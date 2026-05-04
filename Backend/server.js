require("dotenv").config();
const DB = require("./config/db.js");
DB();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Routes
const authRoute = require("./routes/authRoutes.js");
const productRoute = require("./routes/productRoutes.js");
const orderRoute = require("./routes/orderRoute.js");
const cartRoute = require("./routes/cartRoutes.js");
const reviewRoute = require("./routes/reviewRoutes.js");
const paymentRoute = require("./routes/paymentRoute.js");
const bannerRoute = require("./routes/bannerRoutes.js");
const dashboardStats = require("./routes/dashboardRoute.js");

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// API Routes
app.use("/api/payment", paymentRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/banners", bannerRoute);
app.use("/api/dashboard", dashboardStats);

// 404
app.all("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Internal server error" } = err;
    res.status(status).json({ message });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("App listening to port", port);
});