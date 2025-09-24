const express = require('express');
const itemsController = require('../controllers/itemsController');

const router = express.Router();

router.get('/', itemsController.index);
router.get('/code/:code', itemsController.findByCode);
router.get('/:id', itemsController.show);
router.post('/', itemsController.create);
router.put('/:id', itemsController.update);
router.delete('/:id', itemsController.delete);

module.exports = router;
