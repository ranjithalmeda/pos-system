const express = require("express");
const router = express.Router();
const Sale = require("../models/saleModel");
const Product = require("../models/product");

// POST /api/sales => record a sale
router.post("/", async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Reduce stock
    for (const item of cart) {
      const product = await Product.findById(item._id);
      if (!product) continue;
      product.quantity -= item.quantity;
      await product.save();
    }

    // Create sale record
    const sale = new Sale({
      products: cart.map((p) => ({
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
      total,
    });

    await sale.save();

    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
