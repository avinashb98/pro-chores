const express = require('express');
const worker = require('../controllers/worker');
const verifyToken = require('../middlewares/verifyToken');
const validate = require('../controllers/validators/workerValidator');

const router = express.Router();

router.post('/', validate.signUp, worker.signUp);
router.post('/login', worker.login);

// Authentication Middleware
router.use(verifyToken);

// Accept a task
router.get('/tasks', worker.getTasks);
router.put('/task/accept', worker.acceptTask);
router.put('/task/mark-complete', worker.completeTask);
router.get('/tasks/completed', worker.getCompletedTasks);
router.get('/tasks/incomplete', worker.getInCompleteTasks);

module.exports = router;
