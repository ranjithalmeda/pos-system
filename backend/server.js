// 1️⃣ Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");



// 2️⃣ Config
dotenv.config(); // load .env variables

// 3️⃣ Express setup
const app = express();

// 4️⃣ Middleware
app.use(cors({
    origin: "http://localhost:3000", // allow frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json()); // parse JSON requests

// 5️⃣ Routes
app.get("/", (req, res) => res.send("Hello, World!"));
app.get("/api/test", (req, res) => res.json({ message: "API is working!" }));
app.use("/api/products", productRoutes); // Product CRUD routes
app.use("/api/sales", saleRoutes); // Sales routes

// 6️⃣ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch(err => console.log("MongoDB connection error:", err));

// 7️⃣ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
