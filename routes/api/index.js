// index.js allows for easier scalability
const router = require('express').Router();
const userRoutes = require('./user-routes');

// routes
// - index.js---user-routes.js
// - /users/
router.use('/users', userRoutes);

module.exports = router;