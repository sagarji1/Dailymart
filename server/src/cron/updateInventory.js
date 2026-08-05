const cron = require("node-cron");
const Product = require("../model/inventoryModel"); 

function predictExpiryRisk(item) {
  const today = new Date();
  const expiry = new Date(item.ExpiryDate);
  const daysRemaining = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  
  const avgSales = Number(item.AvgDailySales);
  if (!avgSales || isNaN(avgSales) || avgSales <= 0) {
    if (daysRemaining < 3) return "High";
    if (daysRemaining < 7) return "Medium";
    return "Low";
  }

  const daysToSell = item.StockQty / avgSales;

  if (daysRemaining < daysToSell) return "High";
  if (daysRemaining < daysToSell * 1.5) return "Medium";
  return "Low";
}

// Scheduled function
const runInventoryUpdater = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const products = await Product.find();

      for (let product of products) {
        const daysRemaining = Math.ceil(
          (new Date(product.ExpiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        const risk = predictExpiryRisk(product);

        await Product.findByIdAndUpdate(product._id, {
          DaysRemaining: daysRemaining,
          RiskLevel: risk,
        });
      }

      console.log("✅ Inventory updated by cron job at midnight");
    } catch (error) {
      console.error("❌ Cron job error:", error.message);
    }
  });
};

module.exports = runInventoryUpdater;
