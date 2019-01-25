const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  },
  claimedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Worker'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  },
  status: {
    type: String,
    default: 'unclaimed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', TaskSchema);
