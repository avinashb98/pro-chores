const Joi = require('joi');
const Worker = require('../../models/consumer');

const workerWithEmailExists = async (email) => {
  let worker;
  try {
    worker = await Worker.findOne({ email });
  } catch (error) {
    throw error;
  }

  if (worker) {
    return true;
  }
  return false;
};

const ValidateSignup = Joi.object().keys({
  name: Joi.string().min(2).max(30),
  password: Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).required(),
  email: Joi
    .string()
    .regex(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)
    .required()
});

const signUp = async (req, res, next) => {
  const { error, value } = ValidateSignup.validate(req.body);
  if (error) {
    res.status(400).json({
      message: `Invalid input format. ${error.message}`
    });
    return;
  }

  if (await workerWithEmailExists(value.email)) {
    res.status(400).json({
      message: 'This email is associated with an existing user'
    });
    return;
  }

  req.body = value;
  next();
};


const ValidateLogin = Joi.object().keys({
  password: Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).required(),
  email: Joi
    .string()
    .regex(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)
    .required()
});

const login = async (req, res, next) => {
  const { error, value } = ValidateLogin.validate(req.body);
  if (error) {
    res.status(400).json({
      message: `Invalid input format. ${error.message}`
    });
    return;
  }

  req.body = value;
  next();
};

module.exports = { signUp, login };
