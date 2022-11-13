const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates Post model
class Post extends Model {
    static upvote(body, models) { // static keyword indicates that upvote method is based on Post model, not an instance method
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {id: body.post_id},
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

Post.init(
    { // parameter 1 | defines field columns Post schema
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true, // primary key of Post table
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        },
        user_id: { // foreign key
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    { // parameter 2 | configures metadata
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;