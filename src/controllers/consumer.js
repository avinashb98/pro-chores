const passport = require('passport');
const Consumer = require('../models/consumer');

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

module.exports = {
  signUp,
  login
};
