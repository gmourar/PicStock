const express = require('express');
const movementsController = require('../controllers/movementsController');

const router = express.Router();

router.get('/', movementsController.list);
router.post('/', movementsController.create);

module.exports = router;
