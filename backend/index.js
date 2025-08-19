require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Models (if needed directly)
const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

// Routes
const authRoute = require("./Routes/AuthRoute");

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

// ------------------- DATABASE CONNECTION ------------------- //
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ------------------- MIDDLEWARE ------------------- //
app.use(
  cors({
    origin: ["http://localhost:3001"], // frontend URL
    methods: ["POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ------------------- ROUTES ------------------- //

// Auth-related routes (signup, login, etc.)
app.use("/", authRoute);

// GET all holdings
app.get("/allholdings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

// GET all positions
app.get("/allpositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

// POST new order
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    const newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();
    res.status(200).json({ message: "Order saved!" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Failed to save order" });
  }
});

// GET all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await OrdersModel.find().sort({ _id: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ------------------- SERVER START ------------------- //
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
