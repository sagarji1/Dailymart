const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    userId: String,
    products: [
      {
        name: String,
        sku: String,
        quantity: Number,
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
