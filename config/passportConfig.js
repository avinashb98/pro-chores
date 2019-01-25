const passport = require('passport');
const CustomStrategy = require('passport-custom');
const Worker = require('../src/models/worker');
const Consumer = require('../src/models/consumer');

passport.use('worker', new CustomStrategy((req, done) => {
  const { email, password } = req.body;
  Worker.findOne({ email })
    .then((worker) => {
      if (!worker || !worker.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, worker);
    }).catch(done);
}));

passport.use('consumer', new CustomStrategy((req, done) => {
  const { email, password } = req.body;
  Consumer.findOne({ email })
    .then((consumer) => {
      if (!consumer || !consumer.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, consumer);
    }).catch(done);
}));
