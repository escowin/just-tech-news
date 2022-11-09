// import the Sequelize constructor from the library
const Sequelize = require('sequelize');
// hiding sensitive data from remote repo
require('dotenv').config()

// create connection to the just tech news database. database, user, password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;