require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const apiRouter = require('./api/index')

app.use(morgan('dev'))

app.use(cors())

app.use(bodyParser.json())

app.use('/api', [apiRouter])

app.use((req, res) => {
    res.status(404)
    res.send({
       message: "Page not found"
    })
})

app.use((error, req, res, next) => {
    res.status(500)
    res.send(error)
    console.log(error)
    next()
})

module.exports = app;
