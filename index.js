// Configurações
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const port = 3000

const app = express()

// Define tipo de resposta da API
app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

// Public route

app.get('/', (req, res) => {
  return res.status(200).json({ msg: 'Bem vindo a nossa API' })
})

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jwtcluster.b5okz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('API se conectou ao DB')
    app.listen(port, () => {
      console.log('API rodando na porta: http://localhost:3000/')
    })
  })
  .catch(error => {
    console.log(error)
  })
