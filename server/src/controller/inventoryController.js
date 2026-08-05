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

const getPredictions = async (req, res) => {
  try {
    const products = await Product.find();
    const predictions = products.map((item) => {
      const daysRemaining = Math.ceil(
        (new Date(item.ExpiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      const risk = predictExpiryRisk(item);

      return {
        SKU: item.SKU,
        StoreID: item.StoreID,
        stockName: item.stockName,
        stockUrl: item.stockUrl,
        stockPrice: item.stockPrice,
        ExpiryDate: item.ExpiryDate,
        StockQty: item.StockQty,
        AvgDailySales: item.AvgDailySales,
        DaysRemaining: daysRemaining,
        RiskLevel: risk,
      };
    });

    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const daysRemaining = Math.ceil(
      (new Date(data.ExpiryDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    const risk = predictExpiryRisk(data);

    const newProduct = new Product({
      ...data,
      DaysRemaining: daysRemaining,
      RiskLevel: risk,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHighRiskProducts = async (req, res) => {
  try {
    const highRiskItems = await Product.find({ RiskLevel: "High" });
    const result = highRiskItems.map((item) => ({
      SKU: item.SKU,
      StoreID: item.StoreID,
      stockName: item.stockName,
      stockUrl: item.stockUrl,
      stockPrice: item.stockPrice,

      ExpiryDate: item.ExpiryDate,
      StockQty: item.StockQty,
      AvgDailySales: item.AvgDailySales,
      DaysRemaining: Math.ceil(
        (new Date(item.ExpiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      ),
      RiskLevel: item.RiskLevel,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPredictions, createProduct, getHighRiskProducts };
