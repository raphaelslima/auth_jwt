const router = require('express').Router()
const bcrypt = require('bcrypt')
const { route } = require('express/lib/application')
const jwt = require('jsonwebtoken')

// models
const User = require('../models/User')

// middleware
const verifyToken = require('../middleware/verifyToken')

// helpers
const getuserByToken = require('../helpers/getUserByToken')

// Cria usuário
router.post('/register', async (req, res) => {
  // Validação dos campos da requisição

  const { name, email, password, confimPassword } = req.body

  if (!name || !email || !password || !confimPassword) {
    return res.status(422).json({ msg: 'Todos os campos são obrigatórios' })
  }

  // Valida se as senhas são iguais
  if (password !== confimPassword) {
    return res.status(422).json({ msg: 'As senhas não são iguais' })
  }

  // Valida se o usuário existe
  const checkUserExist = await User.findOne({ email: email })

  if (checkUserExist) {
    return res.status(422).json({ msg: 'Usuário já existe' })
  }

  //Cryptografa a senha
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  // Cria classe que armazna os dados
  const user = {
    name: name,
    email: email,
    password: passwordHash
  }

  // Salva os dados no DB
  try {
    const newUser = await User.create(user)
    return res
      .status(200)
      .json({ msg: 'Cadastro realizado com sucesso', newUser: newUser })
  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ msg: 'Erro no servidor, tente novamente mais tarde' })
  }
})

// Login
router.post('/login', async (req, res) => {
  // captura os dados da requisição
  const { email, password } = req.body

  // Verifica se os campos estão preenchidos
  if (!email || !password) {
    return res.status(422).json({ msg: 'Os campos são obrigatórios' })
  }

  // Verifica se o usuário existe
  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' })
  }

  // Verifica se a senha é do usuário
  const checkPassword = await bcrypt.compare(password, user.password)

  if (!checkPassword) {
    return res.status(404).json({ msg: 'Senha incorreta' })
  }

  const DB_SECRET = process.env.DB_SECRET

  try {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        password: user.password
      },
      DB_SECRET
    )

    return res
      .status(200)
      .json({ msg: 'Login efetuado com sucesso', token: token })
  } catch (error) {
    console.log(error)

    return res
      .status(500)
      .json({ msg: 'Erro no servidor, tente novamente mais tarde' })
  }
})

// Rota privada
router.get('/:id', verifyToken, async (req, res) => {
  // Pega os dados da url
  const id = req.params.id

  // Captura token
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  const userByToken = await getuserByToken(token)

  if (userByToken.id !== id) {
    return res.status(401).json({ msg: 'Acesso negado' })
  }

  //Verifica se o DB possui esse usuário
  const user = await User.findOne({ _id: id }, { password: 0 })

  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' })
  }

  return res.status(200).json({ msg: 'Usuário encontrado', user: user })
})
module.exports = router
