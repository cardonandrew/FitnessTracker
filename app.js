require('dotenv').config()
const PORT = 3000 || process.env.PORT
const express = require('express')
const app = express()
const cors = require('cors')
const { client } = require('./db')
const morgan = require('morgan')
const { apiRouter } = require('./api/index')

app.use(morgan('dev'))

app.use(cors())

app.use(express.json())

app.use('/api', (req, res, next) => {
    try{
        console.log("you're in the api router")
    } catch(error){
        next(error)
    }
}, apiRouter)

app.use((req, res) => {
    res.status(404)
    res.send("Page not found")

})

app.use((error, req, res, next) => {
    res.status(500)
    res.send(error)
    console.log(error)
    next()
})

const isActive = app.listen(PORT, () => {
    console.log("I'm listening on port" + PORT)
})

if(isActive){
    client.connect()
}

module.exports = app;
