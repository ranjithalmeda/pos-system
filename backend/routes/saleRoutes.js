const express = require("express");
const router = express.Router();

const Sale = require("../models/saleModel");
const Product = require("../models/product");


// ✅ GET all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ POST record a sale
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({ message: `Product not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      product.quantity -= item.quantity;
      await product.save();
    }

    const sale = new Sale({
      products: items.map((p) => ({
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
      total,
    });

    await sale.save();
    console.log("Sale saved:", sale);

    res.status(201).json({ message: "Sale recorded successfully", sale });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ EXPORT ROUTER (VERY IMPORTANT)
module.exports = router;