const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const consumer = require('../controllers/consumer');
const validate = require('../controllers/validators/consumerValidator');

const router = express.Router();

router.post('/', validate.signUp, consumer.signUp);
router.post('/login', validate.login, consumer.login);

// Authentication Middleware
router.use(verifyToken);

router.post('/task', validate.create, consumer.postTask);
router.get('/tasks', consumer.getTasks);
router.post('/rate-worker', consumer.rateWorker);

module.exports = router;
