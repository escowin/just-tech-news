// acting callback function | checks for the existence of a session property
const withAuth = (req, res, next) => {
    // redirects non-logged in user to login page.
    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        // middleware for logged in users
        next();
    }
};

module.exports = withAuth;