const passport = require('passport');
const Consumer = require('../models/consumer');
const Task = require('../models/task');

const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  let newConsumer;
  try {
    newConsumer = new Consumer({ email, password, name });
    await newConsumer.setPassword(password);
    await newConsumer.save();
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  res.status(201).json({
    message: 'New Consumer Successfuly Created',
    data: {
      name: newConsumer.name,
      email: newConsumer.email
    }
  });
};

const login = async (req, res) => {
  passport.authenticate('consumer', { session: false }, (err, consumer, info) => {
    if (err) {
      res.status(403).json({
        message: 'Unable to authenticate worker',
        data: {}
      });
      return;
    }

    if (!consumer) {
      res.status(404).json({
        message: 'Authentication failed',
        data: {}
      });
      return;
    }

    const user = consumer;
    user.token = consumer.generateJWT();

    res.status(200).json({
      message: 'Login Successful',
      data: { user: consumer.toAuthJSON() }
    });
  })(req, res);
};

const postTask = async (req, res) => {
  const {
    name, description, location, category
  } = req.body;
  const consumerId = req.decoded.id;

  let newTask;
  try {
    newTask = await Task.create({
      name,
      description,
      'location.coordinates': location,
      requestedBy: consumerId,
      category
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  res.status(201).json({
    message: 'New Task Successfuly Created',
    data: {
      name: newTask.name,
      email: newTask.description
    }
  });
};

const getTasks = async (req, res) => {
  const consumerId = req.decoded.id;
  let tasks;
  try {
    tasks = await Task.find({ requestedBy: consumerId }).lean();
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      data: {}
    });
    return;
  }

  if (tasks.length === 0) {
    res.status(404).json({
      message: 'No tasks have been created by you.'
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

module.exports = {
  signUp,
  login,
  postTask,
  getTasks
};
