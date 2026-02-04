const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Fix OverwriteModelError by checking if model already exists
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
