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

module.exports = mongoose.model("Product", productSchema);
