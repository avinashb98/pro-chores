const express = require('express');
const worker = require('../controllers/worker');

const router = express.Router();

router.post('/', worker.signUp);

module.exports = router;
