const passport = require('passport');
const Worker = require('../models/worker');
const Task = require('../models/task');

const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  let newWorker;
  try {
    newWorker = new Worker({ email, password, name });
    await newWorker.setPassword(password);
    await newWorker.save();
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  res.status(201).json({
    message: 'New Worker Successfuly Created',
    data: {
      name: newWorker.name,
      email: newWorker.email
    }
  });
};

const login = async (req, res) => {
  passport.authenticate('worker', { session: false }, (err, worker, info) => {
    if (err) {
      res.status(403).json({
        message: 'Unable to authenticate worker',
        data: {}
      });
      return;
    }

    if (!worker) {
      res.status(404).json({
        message: 'Authentication failed',
        data: {}
      });
      return;
    }

    const user = worker;
    user.token = worker.generateJWT();

    res.status(200).json({
      message: 'Login Successful',
      data: { user: worker.toAuthJSON() }
    });
  })(req, res);
};

const acceptTask = async (req, res) => {
  const { taskId } = req.body;
  const workerId = req.decoded.id;
  let task;
  try {
    task = await Task.findById(taskId);
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  if (task.status !== 'unclaimed') {
    res.status(403).json({
      message: 'This task has already been claimed',
      data: {}
    });
    return;
  }

  try {
    task.claimedBy = workerId;
    task.status = 'inProgress';
    task.save();
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  res.status(200).json({
    message: 'This task is successfully assigned to you',
    dat: {
      taskId: task._id
    }
  });
};

const completeTask = async (req, res) => {
  const workerId = req.decoded.id;
  const { taskId } = req.body;
  let task;
  try {
    task = await Task.findById(taskId);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  if (task.length === 0) {
    res.status(404).json({
      message: 'Task not found',
      data: {}
    });
    return;
  }

  if (task.claimedBy.toString() !== workerId.toString()) {
    console.log(task.claimedBy);
    console.log(workerId);
    res.status(403).json({
      message: 'This task is not claimed by you',
      data: {}
    });
    return;
  }

  try {
    task.status = 'completed';
    await task.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  res.status(200).json({
    message: 'Task status successfully changed to completed',
    data: {}
  });
};

const getTasks = async (req, res) => {
  let tasks;
  try {
    tasks = await Task.find({ status: 'unclaimed' }).lean();
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  if (tasks.length === 0) {
    res.status(404).json({
      message: 'No tasks found.'
    });
    return;
  }

  res.status(200).json({
    message: 'List of tasks',
    data: {
      tasks
    }
  });
};

const getCompletedTasks = async (req, res) => {
  const workerId = req.decoded.id;
  let tasks;
  try {
    tasks = await Task.find({ claimedBy: workerId, status: 'completed' }).lean();
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  if (tasks.length === 0) {
    res.status(404).json({
      message: 'No tasks found.'
    });
    return;
  }
  res.status(200).json({
    message: 'List of completed tasks',
    data: {
      tasks
    }
  });
};

const getInCompleteTasks = async (req, res) => {
  const workerId = req.decoded.id;
  let tasks;
  try {
    tasks = await Task.find({ claimedBy: workerId, status: 'inProgress' }).lean();
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  if (tasks.length === 0) {
    res.status(404).json({
      message: 'No tasks found.'
    });
    return;
  }
  res.status(200).json({
    message: 'List of incomplete tasks',
    data: {
      tasks
    }
  });
};

module.exports = {
  signUp,
  login,
  acceptTask,
  getTasks,
  completeTask,
  getCompletedTasks,
  getInCompleteTasks
};
