require('dotenv').config()
const DB = require("./config/db.js")
DB()
const express = require("express");
const cors = require("cors");
const path = require("path")
const app = express();


const authRoute = require("./routes/authRoutes.js")
const productRoute = require("./routes/productRoutes.js")
const orderRoute = require("./routes/orderRoute.js")
const cartRoute = require("./routes/cartRoutes.js")
const reviewRoute = require("./routes/reviewRoutes.js")
const paymentRoute = require("./routes/paymentRoute.js")
const bannerRoute = require("./routes/bannerRoutes.js")

const dashboardStats = require("./routes/dashboardRoute.js")
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
    res.send("it is running")
})

app.use("/api/payment", paymentRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/orders", orderRoute)
app.use("/api/cart", cartRoute)
app.use("/api/reviews", reviewRoute)
app.use("/api/banners", bannerRoute)

app.use("/api/dashboard", dashboardStats)

let port = process.env.PORT || 8080

app.get("*", (req, res) => {
    res.send("404 Not Found")
})
app.use((err, req, res, next) => {
    let { status = 500, message = "Internal server error" } = err
    res.status(status).json({ message })
})

app.listen(port, () => {
    console.log("App listening to port", port)
})