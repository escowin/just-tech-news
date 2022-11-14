// importing all models to the index
const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// relationships | one-to-many : User holds no reference to owned Post data to prevent unecessary duplication
// - a user can have many posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});
// - each post can only belongs to a specific user
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// relationship | many-to-many : User and Post models can query each other's information in the context of a vote
// - many Users can vote on many posts
User.belongsToMany(Post, {
    through: Vote, // references the Vote through table
    as: "voted_posts",
    foreignKey: "user_id"
});

Post.belongsToMany(User, {
    through: Vote,
    as: "voted_posts",
    foreignKey: "post_id"
});

// relationship | one-to-one
// - user-vote 
Vote.belongsTo(User, {
    foreignKey: "user_id"
});

// - post-vote to see the total number of votes on a post
Vote.belongsTo(Post, {
    foreignKey: "post_id"
});

// relationship | many-to-many
User.hasMany(Vote, {
    foreignKey: "user_id"
});

Post.hasMany(Vote, {
    foreignKey: "post_id"
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: "post_id"
});

User.hasMany(Comment, {
    foreignKey: "user_id"
});

Post.hasMany(Comment, {
    foreignKey: "post_id"
});

module.exports = { User, Post, Vote, Comment };