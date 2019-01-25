const Worker = require('../models/worker');

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
  }

  res.status(201).json({
    message: 'New Worker Successfuly Created',
    data: {
      name: newWorker.name,
      email: newWorker.email
    }
  });
};

module.exports = {
  signUp
};
