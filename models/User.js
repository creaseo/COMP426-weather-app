const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pin: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{4}$/.test(v); //validate that the pin is 4 digits
      },
      message: props => `${props.value} is not a valid 4-digit PIN!`
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;