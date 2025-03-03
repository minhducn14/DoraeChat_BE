const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const UserMiddleware = require('../middleware/UserMiddleware');

router.get('/exists/:id', UserController.existsById);
router.post('/check-ids', UserController.checkByIds);
router.get('/:id', UserController.getById);
router.get('/exists/username/:username', UserController.existsByUsername);
router.get('/username/:username', UserController.findByUsername);
router.get('/check/:id', UserController.checkById);
router.get('/summary/:id', UserController.getSummaryById);
router.post('/', UserController.addUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;