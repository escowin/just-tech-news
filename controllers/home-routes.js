const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session)
    console.log('======================');
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
        res.render('homepage', { 
            posts,
            loggedIn: req.session.loggedIn
         });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

// route | ::server::/login
router.get('/login', (req, res) => {
    // view | ./views/login
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// route | ::server::/post/:id
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
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
        if (!dbPostData) {
            res.status(404).json({ message: 'post with this id not found' });
            return;
        }

        // serialized data
        const post = dbPostData.get({ plain: true });

        // passes the data to the template 
        // - views/single-post.handlebars
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;