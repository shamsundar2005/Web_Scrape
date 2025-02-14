require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed", err));

// Define Zepto Schema
const ZeptoSchema = new mongoose.Schema(
  {
    _id: String,
    "web-scraper-order": String,
    "web-scraper-start-url": String,
    link: String,
    "link-href": String,
    brand: String,
    name: String,
    price: String,
    "coupons and offers": String,
    "image-src": String,
    "seller deta": String,
    highlight: String,
  },
  { collection: "Zepto" } // Explicit collection name
);

const Zepto = mongoose.model("Zepto", ZeptoSchema);

// Define big_basket Schema
const BigBasketSchema = new mongoose.Schema(
  {
    id: String,
    Title: String,
    Title_URL: String,
    Image: String,
    Like: String,
    Label: String,
    Label1: String,
    Label3: String,
    Label4: String,
    Field9: String,
    Field10: String,
    Field11: String,
  },
  { collection: "big_basket" } // Explicit collection name
);

const BigBasket = mongoose.model("big_basket", BigBasketSchema);

// Search API
app.get("/api/products/search", async (req, res) => {
  const query = req.query.q;
  console.log("Search query:", query);

  try {
    // Search Zepto collection
    const zeptoResults = await Zepto.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    });
    
    // Search big_basket collection
    const bigBasketResults = await BigBasket.find({
      $or: [
        { Title: { $regex: query, $options: "i" } },
        { Label: { $regex: query, $options: "i" } },
      ],
    });
    
    // Combine results
    const combinedResults = [
      ...zeptoResults.map((item) => ({ ...item._doc, source: "Zepto" })),
      ...bigBasketResults.map((item) => ({ ...item._doc, source: "BigBasket" })),
    ];

    res.json(combinedResults); // Send combined results to the frontend
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
