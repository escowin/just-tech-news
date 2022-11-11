// index.js allows for easier scalability
const router = require('express').Router();
const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');

// routes | users & posts
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;