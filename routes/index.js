const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).end();
});

// required import defined as 'routes' in ./server.js
module.exports = router;