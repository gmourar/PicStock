const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get('/', usersController.index);
router.get('/:id', usersController.show);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

// Face endpoints
router.put('/:id/face', usersController.updateFaceDescriptor);
router.post('/identify', usersController.identify);

module.exports = router;
