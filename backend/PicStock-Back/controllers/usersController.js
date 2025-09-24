const { User } = require('../models');

class UsersController {
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'profilePhoto', 'active', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: users, total: users.length });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao buscar usuários', message: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'profilePhoto', 'active', 'createdAt']
      });

      if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado' });

      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao buscar usuário', message: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name, email } = req.body;

      if (!name) return res.status(400).json({ success: false, error: 'Nome é obrigatório' });

      const user = await User.create({ name, email, active: true });

      res.status(201).json({
        success: true,
        data: { id: user.id, name: user.name, email: user.email, active: user.active, createdAt: user.createdAt },
        message: 'Usuário criado com sucesso'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Erro ao criar usuário', message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, active } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado' });

      await user.update({
        name: name ?? user.name,
        email: email ?? user.email,
        active: active ?? user.active
      });

      res.json({
        success: true,
        data: { id: user.id, name: user.name, email: user.email, active: user.active, updatedAt: user.updatedAt },
        message: 'Usuário atualizado com sucesso'
      });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Erro ao atualizar usuário', message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado' });

      await user.update({ active: false });

      res.json({ success: true, message: 'Usuário desativado com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao desativar usuário', message: error.message });
    }
  }

  async updateFaceDescriptor(req, res) {
    try {
      const { id } = req.params;
      const { descriptor } = req.body;

      if (!Array.isArray(descriptor) || descriptor.length === 0) {
        return res.status(400).json({ success: false, error: 'Descriptor inválido' });
      }

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ success: false, error: 'Usuário não encontrado' });

      await user.update({ faceDescriptor: JSON.stringify(descriptor) });

      res.json({ success: true, message: 'Descriptor de face atualizado' });
    } catch (error) {
      res.status(400).json({ success: false, error: 'Erro ao salvar descriptor', message: error.message });
    }
  }

  async identify(req, res) {
    try {
      const { descriptor, threshold = 0.5 } = req.body;

      if (!Array.isArray(descriptor) || descriptor.length === 0) {
        return res.status(400).json({ success: false, error: 'Descriptor inválido' });
      }

      const users = await User.findAll({
        where: { active: true },
        attributes: ['id', 'name', 'email', 'faceDescriptor']
      });

      let best = null;
      let bestScore = -1;

      const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
      const norm = (a) => Math.sqrt(a.reduce((s, v) => s + v * v, 0));
      const cosSim = (a, b) => dot(a, b) / (norm(a) * norm(b));

      for (const u of users) {
        if (!u.faceDescriptor) continue;
        try {
          const d = JSON.parse(u.faceDescriptor);
          if (!Array.isArray(d) || d.length !== descriptor.length) continue;
          const score = cosSim(descriptor, d);
          if (score > bestScore) {
            bestScore = score;
            best = u;
          }
        } catch (_) {}
      }

      if (!best || bestScore < 1 - Number(threshold)) {
        return res.status(404).json({ success: false, error: 'Sem correspondência confiável', score: bestScore });
      }

      res.json({ success: true, data: { id: best.id, name: best.name, email: best.email }, score: bestScore });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Erro ao identificar', message: error.message });
    }
  }
}

module.exports = new UsersController();
