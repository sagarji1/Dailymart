const express = require("express");
const router = express.Router();
const Purchase = require("../model/Purchase");
const { requireAuth } = require("../middleware/auth");

const aiServiceUrl = (process.env.AI_SERVICE_URL || "http://localhost:5000").replace(/\/$/, "");

router.post("/", requireAuth, async (req, res) => {

  try {
    const purchases = await Purchase.find({ userId: req.user.id });
    const history = purchases.flatMap((purchase) => purchase.products);
    const response = await fetch(`${aiServiceUrl}/smart-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history }),
    });

    if (!response.ok) {
      throw new Error(`AI service returned ${response.status}`);
    }

    return res.json(await response.json());
  } catch (error) {
    console.error("SmartCart recommendation error:", error.message);
    return res.status(503).json({ error: "SmartCart is temporarily unavailable" });
  }
});

module.exports = router;
