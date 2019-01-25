const passport = require('passport');
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


module.exports = {
  signUp,
  login
};
