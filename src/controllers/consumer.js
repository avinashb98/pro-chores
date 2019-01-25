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

module.exports = {
  signUp
};
