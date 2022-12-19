require('dotenv').config();
const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./api/index')
const { client } = require('./db/index');

app.use(morgan('dev'));

app.use(cors());

app.use(bodyParser.json())

// app.use('/api', (req, res, next) => {
//     try{
//         console.log("you're in the api router")
//     } catch(error){
//         next(error)
//     }
// }, apiRouter)

app.use('/api', [apiRouter])

app.use((req, res, next) =>{
    res.status(404);
    res.send('Nothing Found');
})

app.use(({message, name}, req, res, next) =>{
    res.status(500);
    res.send({
        success:false,
        data:null,
        error: {
            name,
            message
        }
    });
})

client.connect();

module.exports = app;
