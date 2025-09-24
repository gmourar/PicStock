const express = require('express');
const { Item, StockMovement } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [totalItems, totalMovements, lowStockItems] = await Promise.all([
      Item.count(),
      StockMovement.count(),
      Item.count({ where: { currentQuantity: { [require('sequelize').Op.lte]: require('sequelize').literal('"min_quantity"') } } })
    ]);

    res.json({
      success: true,
      data: {
        totalItems,
        totalMovements,
        lowStockItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao carregar dashboard', message: error.message });
  }
});

module.exports = router;
