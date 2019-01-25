const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const consumer = require('../controllers/consumer');

const router = express.Router();

router.post('/', consumer.signUp);
router.post('/login', consumer.login);

// Authentication Middleware
router.use(verifyToken);

router.post('/task', consumer.postTask);
router.get('/tasks', consumer.getTasks);

module.exports = router;
