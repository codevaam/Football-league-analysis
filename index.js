const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
const nunjucks = require('nunjucks');

require('dotenv').config()

const apiRouter = require("./routes").router;
require('./models').connect(process.env.DB_HOST);

const app = express();
app.set('views', path.join(__dirname, 'templates'));

const templateFolder = path.join(__dirname, 'templates');
const mainLayout = path.join(templateFolder, 'main');
const partialsFolder = path.join(templateFolder, 'partials');
const staticFolder = path.join(__dirname, 'static');


app.engine('html', nunjucks.render);
app.set('view engine', 'html');

nunjucks.configure('templates', {
    autoescape: true,
    express: app,
    watch: true
});

app.use('/static', express.static(staticFolder));
app.use(apiRouter);

app.get('/', function (req, res) {
    res.send("Hello World!");
});

const port = process.env.PORT;
app.listen(port, () => console.log(`App listening on port ${port}!`))