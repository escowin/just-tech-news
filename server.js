const path = require('path');
const express = require('express'); // server
const routes = require('./controllers/'); // collects & packages everything for server.js
const sequelize = require('./config/connection'); // connection to Sequelize
const exphbs = require('express-handlebars'); // template views
const session = require('express-session'); // login method
const helpers = require('./utils/helpers'); // format helpers

const hbs = exphbs.create({ helpers }); // passing helpers
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001;

// express middleware | setting up frontend & backend data transfers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // frontend connection. this method takes all contents of a folder and serves them as static assets.

// session middleware | creates a login session & connects it to the sequelized database
app.use(session(sess))
// turns on routes
app.use(routes);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// turns on connection to database and server
// - set to true when updating the relationship betwixt tables.
sequelize.sync({ force: false }).then(() => { // sql DROP TABLE IF EXISTS
    app.listen(PORT, () => console.log('Now listening'));
});