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

// Define Product Schema
const ProductSchema = new mongoose.Schema({
  search_term: String,
  product_name: String,
  brand: String,
  mrp: String,
  price: String,
  discount: String,
  image_url: String,
  details: String,
  review_star_avg: String,
  link: String,
}, { collection: "big_basket" });  // Explicit collection name

const Product = mongoose.model("big_basket", ProductSchema);

// Search API
app.get("/api/products/search", async (req, res) => {
  const query = req.query.q;
  try {
    const products = await Product.find({
      $or: [
        { product_name: { $regex: query, $options: "i" } },
        { search_term: { $regex: query, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
