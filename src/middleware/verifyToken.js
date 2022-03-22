const jwt = require('jsonwebtoken')

const verifyToken = async (req, res, next) => {
  // Captura o token
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // Verifica se existe
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado' })
  }

  try {
    const secret = process.env.DB_SECRET

    // Vetifica o token
    jwt.verify(token, secret)
  } catch (error) {
    return res.status(401).json({ msg: 'Token inválido' })
  }

  next()
}

module.exports = verifyToken
