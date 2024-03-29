const router = require("express").Router();
const { User, Post, Vote, Comment } = require("../../models");

// restful api pattern https://restfulapi.net/
// - name endpoints in a way that describe the data that being interfaced, /api/users
// - use http methods like 'get, post, put, delete' to describe performing action interfacing with that endpoint, GET /api/users
// - use proper http status codes like '400, 404, 500' to indicate errors in a request

// crud | gets all users
// /api/users/
router.get("/", (req, res) => {
  // orm | accesses User model and runs .findAll method
  User.findAll({
    // SELECT * FROM users;
    attributes: { exclude: ["password"] }, // instructs sql query to exclude password column
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// crud | get a user
// /api/users/:id
router.get("/:id", (req, res) => {
  User.findOne({
    // SELECT * FROM users WHERE id = 1
    attributes: { exclude: ["password"] },
    where: {
      id: req.params.id,
    },
    include: [

      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      { // includes Comment model
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
      { // recieves title information of every voted post by the user
        model: Post,
        attributes: ['title'],
        through: Vote, // through tables provides the contact.
        as: 'voted_posts'
      }
    ]
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "no user found with this id " });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// crud | post a new user
// /api/users/?
router.post("/", (req, res) => { // api/users/
  // INSERT INTO (users, email, password) VALUES ("username value", "email value, "password value");
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
  // login | replaced then((dbUserData) => res.json(dbUserData))
    .then(dbUserData => {
      req.session.save(() => {
        // server acccess to user_id, username, and loged in boolean
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// - verifying user identity w/ email & password
// - /api/users/login
router.post('/login', (req, res) => {
  // route: /api/users/login
  // {email: 'email', password: 'password'}
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'user not found with this email'});
      return;
    }

    // verify user
    const validPassword = dbUserData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({ message: 'incorrect password' });
      return;
    }

    req.session.save(() => {
      // declared session variables
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'you are now logged in' });
    });
  });
});

// crud | post | logging out
router.post('/logout', (req, res) => {
  // must be logged in to log out
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// - crud | update users
// - /api/users/:id
router.put("/:id", (req, res) => {
  // pass in req.body instead to only update what's passed through
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "no user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// - crud | delete users
// - /api/users/:id
router.delete("/:id", (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "no user found with this id" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
