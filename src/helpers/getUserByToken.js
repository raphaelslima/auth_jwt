const jwt = require('jsonwebtoken')

const User = require('../models/User')

const getuserByToken = async token => {
  const secret = process.env.DB_SECRET

  const decoded = jwt.verify(token, secret)

  const userId = decoded.id

  const user = await User.findOne({ _id: userId })

  return user
}

module.exports = getuserByToken
