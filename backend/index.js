require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");


const HoldingsModel = require("./model/HoldingsModel");
const PositionsModel = require("./model/PostionsModel");
const OrdersModel = require("./model/OrderModel");


const PORT = process.env.PORT || 3002;
// const url = "mongodb+srv://<dummy>:<dummy>@cluster.mongodb.net/db";
const url = process.env.MONGO_URL;

const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(bodyParser.json());


app.use("/api/auth", require("./routes/authorRoute"));

// ---------------------------
// GET Holdings
// ---------------------------
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});

// ---------------------------
// GET Positions
// ---------------------------
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});

// ---------------------------
// GET All Orders
// ---------------------------
app.get("/allOrders", async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({});
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// ---------------------------
// NEW ORDER (BUY ONLY)
// ---------------------------
app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    if (!name || !qty || !price || !mode) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    console.log("Order request received");



    // Save order
    const newOrder = new OrdersModel({ name, qty, price, mode });
    await newOrder.save();

    // Update Holdings
    const existingHolding = await HoldingsModel.findOne({ name });

    if (mode === "BUY") {
      if (existingHolding) {
        const totalQty = existingHolding.qty + qty;

        const avgPrice =
          (existingHolding.avg * existingHolding.qty + price * qty) / totalQty;

        existingHolding.qty = totalQty;
        existingHolding.avg = avgPrice;
        existingHolding.price = price;
        existingHolding.net = "+0%";
        existingHolding.day = "+0%";

        await existingHolding.save();
      } else {
        await HoldingsModel.create({
          name,
          qty,
          avg: price,
          price,
          net: "+0%",
          day: "+0%",
        });
      }
    }

    res.json({ message: "Order saved & holdings updated!" });
  } catch (err) {
    console.error("Error in /newOrder:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------------
// SELL ORDER
// ---------------------------
app.post("/sell", async (req, res) => {
  const { uid, sellQty, sellPrice, ltp } = req.body;

  try {
    const holding = await HoldingsModel.findById(uid);

    if (!holding) return res.status(404).send("Holding not found");

    if (sellQty > holding.qty)
      return res.status(400).send("Not enough quantity");

    // Profit Calculation
    const profitPerShare = sellPrice - holding.avg;
    const realizedProfit = profitPerShare * sellQty;

    // Update qty
    holding.qty -= sellQty;

    // Update Last traded Price
    holding.price = ltp || sellPrice;

    if (holding.qty > 0) {
      const currVal = holding.price * holding.qty;
      const totalCost = holding.avg * holding.qty;

      const percentChange = ((currVal - totalCost) / totalCost) * 100;

      holding.net = percentChange.toFixed(2) + "%";
      holding.day = "+0%";

      await holding.save();
    } else {
      // Delete if all sold
      await HoldingsModel.deleteOne({ _id: uid });
    }

    // Save SELL order
    await OrdersModel.create({
      name: holding.name,
      mode: "SELL",
      qty: sellQty,
      price: sellPrice,
      realizedProfit,
      ltp: ltp || sellPrice,
      date: new Date(),
    });

    res.status(200).json({
      message: "Sold successfully!",
      realizedProfit,
      remainingQty: holding.qty > 0 ? holding.qty : 0,
      remainingAvg: holding.qty > 0 ? holding.avg : null,
      ltp: ltp || sellPrice,
    });
  } catch (err) {
    console.error("Error in /sell:", err);
    res.status(500).send("Error processing sale");
  }
});

// ---------------------------
// START SERVER + CONNECT DB
// ---------------------------
mongoose
  .connect(url)
  .then(() => {
    console.log("DB Connected!");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.log("DB Error:", err));
