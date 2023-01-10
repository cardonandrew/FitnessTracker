require("dotenv").config();

const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const apiRouter = require("./api/index");
app.use("/api", apiRouter);

app.use('*', (req, res, next) => {
    const err = new Error();
    err.status = 404;
    next(err)
});

app.use(function (error, req, res, next) {
    if (error.status === 500) {
        res.status(500)
        res.send({
            messsage: "500 Internal Server Error",
        });
    } else {
        return next(error);
    }
});

app.use(function (error, req, res, next) {
    if (error.status === 404) {
        res.status(404)
        res.send({
            message: "404 Page Not Found"
        })
    } else {
        return next(error)
    }
})

module.exports = app;
