const path = require('path');
const express = require('express');
const routes = require('./controllers/'); // collects & packages everything for server.js
const sequelize = require('./config/connection'); // connection to Sequelize
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});



const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // frontend connection. this method takes all contents of a folder and serves them as static assets.

// turns on routes
app.use(routes);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// turns on connection to database and server
// - set to true when updating the relationship betwixt tables.
sequelize.sync({ force: false }).then(() => { // sql DROP TABLE IF EXISTS
    app.listen(PORT, () => console.log('Now listening'));
});