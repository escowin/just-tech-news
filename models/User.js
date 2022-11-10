const bcrypt = require('bcrypt')
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates User model. Extending it from seuelize's Model class allows User to inherit Model db crud functionality
class User extends Model {
    // sets up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password); // this. acceses this user's stored hashed string password
    }
}

// this is the part that provides context on how the inherited Model methods work: defines table columns and configuration
User.init( // passing these two argument objects sets the User's data & the table configuration
    { // - user's data object
        id: { // defines id column
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: { // define password username
            type: DataTypes.STRING,
            allowNull: false
        },
        email: { // define password email
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // duplicate emails not allowed
            validate: {
                isEmail: true
            }
        },
        password: { // define password column
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4] // password must be at last four characters long
            }
        }
    },
    { 
        // - hashing the password before user creation. 
        hooks: { // hook option placed in second User.init object
            // set up beforeCreate lifecycle hook functionality
            async beforeCreate(newUserData) { // async-await syntax
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // - hashing an updated password
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },

        // - table configuration options https://sequelize.org/v5/manual/models-definition.html#configuration
        sequelize, // passes in imported sequelize connection (the direct connection to the just tech news database)
        timestamps: false, // dont auto create createdAt/updatedAt timestamp fields
        freezeTableName: true, // dont pluralize name of database table
        underscored: true, // use underscores instead of camel-casing. 'comment_text' v 'commentText'
        modelName: 'user'
    }
);

module.exports = User;