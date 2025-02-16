require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed", err));

// Define Schemas
const ZeptoSchema = new mongoose.Schema(
  {
    _id: String,
    brand: String,
    name: String,
    price: String,
    "image-src": String,
  },
  { collection: "Zepto" }
);
const Zepto = mongoose.model("Zepto", ZeptoSchema);

const BigBasketSchema = new mongoose.Schema(
  {
    id: String,
    Title: String,
    Image: String,
    Label: String,
  },
  { collection: "big_basket" }
);
const BigBasket = mongoose.model("big_basket", BigBasketSchema);

const SwiggySchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    image: String,
    price: String,
    discount: String,
  },
  { collection: "swiggy" }
);
const Swiggy = mongoose.model("Swiggy", SwiggySchema);

const BlinkitSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    image: String,
    price: String,
    discount: String,
  },
  { collection: "blinkit" }
);
const Blinkit = mongoose.model("Blinkit", BlinkitSchema);

// Search API with proper limiting
app.get("/api/products/search", async (req, res) => {
  const query = req.query.q;
  console.log("🔍 Search Query:", query);

  try {
    const [zeptoResults, bigBasketResults, swiggyResults, blinkitResults] = await Promise.all([
      Zepto.find({ name: { $regex: query, $options: "i" } }).limit(5).lean(),
      BigBasket.find({ Title: { $regex: query, $options: "i" } }).limit(5).lean(),
      Swiggy.find({ name: { $regex: query, $options: "i" } }).limit(5).lean(),
      Blinkit.find({ name: { $regex: query, $options: "i" } }).limit(5).lean(),
    ]);

    console.log("✅ Zepto Found:", zeptoResults.length);
    console.log("✅ BigBasket Found:", bigBasketResults.length);
    console.log("✅ Swiggy Found:", swiggyResults.length);
    console.log("✅ Blinkit Found:", blinkitResults.length);

    // Enforce exact limit of 5 results per source
    const combinedResults = [
      ...zeptoResults.slice(0, 5).map((item) => ({ ...item, source: "Zepto" })),
      ...bigBasketResults.slice(0, 5).map((item) => ({ ...item, source: "BigBasket" })),
      ...swiggyResults.slice(0, 5).map((item) => ({ ...item, source: "Swiggy" })),
      ...blinkitResults.slice(0, 5).map((item) => ({ ...item, source: "Blinkit" })),
    ];

    res.json(combinedResults);
  } catch (error) {
    console.error("❌ Error during search:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
