const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
     type: String,
     required: [true, 'Username tidak boleh kosong'] 
  },
  password: {
     type: String,
     required: [true, 'password tidak boleh kosong'] 
  },

});

const User = mongoose.model('User', userSchema);
module.exports = User;