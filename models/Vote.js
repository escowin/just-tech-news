const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// model acts as the through table. Vote connects the data between User & Post tables by referencing primary keys.
class Vote extends Model {}

Vote.init(
    { // 1 user 1 vote | user_id-post_id pairings are unique
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { // foreign key constraint
                model: "user",
                key: "id"
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { // foreign key constraint
                model: "post",
                key: "id"
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote'
    }
);

module.exports = Vote;