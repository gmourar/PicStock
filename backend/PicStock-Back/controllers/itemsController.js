const { Item } = require('../models');
const { Op } = require('sequelize');

class ItemsController {
  async index(req, res) {
    try {
      const { category, search } = req.query;
      const where = {};

      if (category) where.category = category;

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { barcode: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const items = await Item.findAll({ where, order: [['name', 'ASC']] });

      res.json({ success: true, data: items, total: items.length });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao buscar itens', message: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const item = await Item.findByPk(id);

      if (!item) return res.status(404).json({ success: false, error: 'Item não encontrado' });

      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao buscar item', message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name, description, barcode, qrCode, category, minQuantity } = req.body;

      if (!name) return res.status(400).json({ success: false, error: 'Nome é obrigatório' });

      const item = await Item.create({
        name,
        description,
        barcode,
        qrCode,
        category,
        currentQuantity: 0,
        minQuantity: minQuantity || 0
      });

      res.status(201).json({ success: true, data: item, message: 'Item criado com sucesso' });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Erro ao criar item', message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, barcode, qrCode, category, minQuantity } = req.body;

      const item = await Item.findByPk(id);
      if (!item) return res.status(404).json({ success: false, error: 'Item não encontrado' });

      await item.update({
        name: name ?? item.name,
        description: description ?? item.description,
        barcode: barcode ?? item.barcode,
        qrCode: qrCode ?? item.qrCode,
        category: category ?? item.category,
        minQuantity: minQuantity ?? item.minQuantity
      });

      res.json({ success: true, data: item, message: 'Item atualizado com sucesso' });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Erro ao atualizar item', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const item = await Item.findByPk(id);
      if (!item) return res.status(404).json({ success: false, error: 'Item não encontrado' });

      await item.destroy();

      res.json({ success: true, message: 'Item removido com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao remover item', message: error.message });
    }
  }

  async findByCode(req, res) {
    try {
      const { code } = req.params;

      const item = await Item.findOne({
        where: {
          [Op.or]: [{ barcode: code }, { qrCode: code }]
        }
      });

      if (!item) {
        return res.status(404).json({ success: false, error: 'Item não encontrado para este código' });
      }

      res.json({ success: true, data: item });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao buscar item por código', message: error.message });
    }
  }
}

module.exports = new ItemsController();
