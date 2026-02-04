const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

    // POST
/**
 * @route   POST /api/products
 * @desc    Add new product
 */
router.post("/", async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    const product = new Product({
      name,
      price,
      quantity,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

    // GET 


/**
 * @route   GET /api/products
 * @desc    Get all products
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


      // UPDATE

   /**
 * @route   PUT /api/products/:id
 * @desc    Update a product by ID
 */

   router.put("/:id", async (req, res) => {
    try {
      const { name, price, quantity } = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, price, quantity },
        { new: true }         // TO RETURN THE UPDATED PRODUCT
      );

      if(!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

  });

      // DELETE 


    /**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 */

     router.delete("/:id", async (req, res) => {
      try{
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);

        if(!deleteProduct) {
          return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message }); 

      }
     });

module.exports = router;