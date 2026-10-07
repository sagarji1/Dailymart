const express = require("express");
const router = express.Router();
const Purchase = require("../model/Purchase");
const { requireAuth } = require("../middleware/auth");

// Save new purchase
router.post("/save", requireAuth, async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "At least one product is required" });
  }

  const validProducts = products.every((product) =>
    product && typeof product.name === "string" && product.name.trim() &&
    Number.isFinite(Number(product.quantity)) && Number(product.quantity) > 0
  );
  if (!validProducts) {
    return res.status(400).json({ error: "Each product needs a name and a positive quantity" });
  }

  try {
    const newPurchase = new Purchase({
      userId: req.user.id,
      products: products.map(({ name, sku, quantity }) => ({ name: name.trim(), sku, quantity: Number(quantity) })),
    });
    await newPurchase.save();
    res.status(201).json({ message: "Saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch user purchase history
router.get("/:userId", requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const data = await Purchase.find({ userId }).sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
