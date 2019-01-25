const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const WorkerSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String
  },
  salt: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

WorkerSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto.pbkdf2Sync(
    password, this.salt, 10000, 512, 'sha512'
  ).toString('hex');
};

WorkerSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(
    password, this.salt, 10000, 512, 'sha512'
  ).toString('hex');
  return this.passwordHash === hash;
};

WorkerSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 1);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, process.env.JWT_SECRET);
};

WorkerSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('Worker', WorkerSchema);
