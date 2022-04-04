const express = require('express');
const exprhbs = require('express-handlebars');
const path = require('path');
const {createText} = require("./creator");
// const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 2222;

const hbs = exprhbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const corsWhiteList = ['localhost:3000', 'http://213.217.8.92:2222', 'http://mickolka.pp.ua', 'http://192.168.0.103:2222'];
    const origin=req.headers.origin;
    if  (corsWhiteList.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Content-Type', 'text/html');
    res.header('Access-Control-Allow-Headers',
        "*");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({options: "options"});
    }
    next();
});

app.get('/', async (req, res, next) => {
    let text = createText();
    res.render('index', {
       text: text
    });
    // res.status(200).json( {text: text});
});

app.get('/text', (req, res, next) => {
    let text = createText();
    res.status(200).json( {text: text});
})

app.listen(PORT, () => {
    console.log("http://localhost:"+PORT+'/');
});

module.exports = app;
