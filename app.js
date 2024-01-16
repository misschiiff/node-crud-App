const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const connectdb = require('./dbconnection/dbconnect');
require("dotenv").config()
const session = require("express-session")
const PORT= (process.env.port || 19000)


connectdb();



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
app.use(express.json())

app.use(
    session({
        secret:"my secret key",
        saveUninitialized: true,
        resave: false,
    })
);


app.use(( req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use("", require('./routes/routes'))







app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT)
})