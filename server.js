const express = require('express');
const routes = require('./routes'); // collects & packages everything for server.js
const sequelize = require('./config/connection'); // connection to Sequelize

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turns on routes
app.use(routes);

// turns on connection to database and server
// true, DROP TABLE IF EXISTS
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});