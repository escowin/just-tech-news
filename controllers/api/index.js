// ROUTE /api/ | api endpoints are defined here
// - imported modules
const router = require('express').Router();
const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');

// - used endpoints | /api/<route name>
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

// - this module is a required import for ./routes/index.js
module.exports = router;