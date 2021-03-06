const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConsumerRatingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Consumer'
  },
  currentRating: {
    type: Number,
    default: 0
  },
  ratings: [{
    ratedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Worker'
    },
    rating: {
      type: Number
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task'
    },
    ratedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

ConsumerRatingSchema.methods.getRating = function () {
  const ratingsCount = this.ratings.length;
  let totalRating = 0;
  for (let i = 0; i < ratingsCount; i += 1) {
    totalRating += this.ratings[i].rating;
  }
  return (totalRating / ratingsCount).toFixed(1);
};

module.exports = mongoose.model('ConsumerRating', ConsumerRatingSchema);
