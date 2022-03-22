const mongoose = require('mongoose')
const { required } = require('nodemon/lib/config')

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String,
    required: true
  }
})

const User = new mongoose.model('User', userSchema)

module.exports = User
