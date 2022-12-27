const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    // res.render | specifies which template to usee
    Post.findAll({
        // 
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        // console.log(dbPostData[0]);
        // dbPostData contains multiples objects (post, _previousDataValues). by first mapping to the post object, the get method then serializes the specified properties of the post object.
        const posts = dbPostData.map(post => post.get({ plain: true })); 
        // passing in the serialized array of posts
        res.render('homepage', { posts });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

// route | ::server::/login
router.get('/login', (req, res) => {
    // view | ./views/login
    res.render('login');
});

module.exports = router;