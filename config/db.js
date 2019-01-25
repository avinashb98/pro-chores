const mongoose = require('mongoose');

// Mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.info('database connected successfully');
  })
  .catch((err) => {
    console.error(err);
  });

mongoose.connection.on('error', (err) => {
  console.error(err);
  console.info('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});
