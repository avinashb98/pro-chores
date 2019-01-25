const Joi = require('joi');
const Consumer = require('../../models/consumer');

const consumerWithEmailExists = async (email) => {
  let consumer;
  try {
    consumer = await Consumer.findOne({ email });
  } catch (error) {
    throw error;
  }

  if (consumer) {
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

  if (await consumerWithEmailExists(value.email)) {
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

const ValidateCreate = Joi.object().keys({
  name: Joi.string().min(3).required(),
  category: Joi.string().min(3).required(),
  description: Joi.string().min(3).optional(),
  location: Joi.array().length(2).optional()
});

const create = async (req, res, next) => {
  const { error, value } = ValidateCreate.validate(req.body);
  if (error) {
    res.status(400).json({
      message: `Invalid input format. ${error.message}`
    });
    return;
  }

  req.body = value;
  next();
};

module.exports = { signUp, login, create };
