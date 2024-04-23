const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const favoriteSchema = new mongoose.Schema({
  // userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: String, required: true },
  locationName: { type: String, required: true }
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;