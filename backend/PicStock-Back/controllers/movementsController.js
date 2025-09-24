const { sequelize, Item, StockMovement, User } = require('../models');

class MovementsController {
  async list(req, res) {
    try {
      const { itemId, userId, limit = 50 } = req.query;
      const where = {};
      if (itemId) where.itemId = itemId;
      if (userId) where.userId = userId;

      const moves = await StockMovement.findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: Math.min(Number(limit), 200),
        include: [
          { model: Item, as: 'item', attributes: ['id', 'name', 'barcode', 'qrCode'] },
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
        ]
      });

      res.json({ success: true, data: moves });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao listar movimentos', message: error.message });
    }
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const { itemId, userId, movementType, quantity, notes } = req.body;

      if (!itemId || !userId || !movementType || !quantity) {
        return res.status(400).json({ success: false, error: 'Parâmetros inválidos' });
      }
      if (!['IN', 'OUT'].includes(movementType)) {
        return res.status(400).json({ success: false, error: 'movementType deve ser IN ou OUT' });
      }
      const qty = Number(quantity);
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ success: false, error: 'quantity deve ser inteiro > 0' });
      }

      const item = await Item.findByPk(itemId, { transaction: t, lock: true });
      if (!item) return res.status(404).json({ success: false, error: 'Item não encontrado' });

      const user = await User.findByPk(userId, { transaction: t });
      if (!user || user.active === false) {
        return res.status(404).json({ success: false, error: 'Usuário inválido' });
      }

      let newQty = item.currentQuantity;
      if (movementType === 'IN') {
        newQty += qty;
      } else {
        if (item.currentQuantity < qty) {
          return res.status(400).json({ success: false, error: 'Estoque insuficiente para saída' });
        }
        newQty -= qty;
      }

      await item.update({ currentQuantity: newQty }, { transaction: t });

      const movement = await StockMovement.create(
        { itemId, userId, movementType, quantity: qty, notes },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json({ success: true, data: movement, currentQuantity: newQty });
    } catch (error) {
      await t.rollback();
      res.status(400).json({ success: false, error: 'Erro ao registrar movimento', message: error.message });
    }
  }
}

module.exports = new MovementsController();
