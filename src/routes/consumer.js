const express = require('express');
const consumer = require('../controllers/consumer');

const router = express.Router();

router.post('/', consumer.signUp);
router.post('/login', consumer.login);

module.exports = router;
