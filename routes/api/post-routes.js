const router = require("express").Router();
const { Post, User, Vote } = require("../../models");
const sequelize = require("../../config/connection");
const { update } = require("../../models/User");

// CRUD operations /api/posts
// - get all posts | retrieves all posts in the database
router.get("/", (req, res) => {
  console.log("===========");
  Post.findAll({
    // query config
    attributes: [
        "id", 
        "post_url", 
        "title", 
        "created_at", 
        [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id)'), 'vote_count'
        ]
    ],
    order: [["created_at", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// - get a post | retrieves a post by its id
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id, // retrieves id value
    },
    attributes: [
        "id", 
        "post_url", 
        "title", 
        "created_at",
        [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "post with this id not found" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// - create a post | assigns title, post_url, user_id values as req.body properties
router.post("/", (req, res) => {
  Post.create({
    // sql-orm: using req.body to populate post table columns. created_at & updated_at are implied
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id,
  })
    .then((dbPostData) => res.json(dbPostData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// route : /api/posts/upvote
// - update vote count | must be defined before /:id put route. preferential oop method to organize file codebase
router.put("/upvote", (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
     .then(updatePostData => res.json(updatePostData))
     .catch(err => {
        console.log(err);
        res.status(400).json(err);
     });
});

// route : /api/posts/:id
// - update a post | retrieve a post by its id, then alter the value of the title during this instance
router.put("/:id", (req, res) => {
  // using the request parameter to find post
  Post.update(
    // insomnia | preview will display as 1. sql's way to verify that the number of rows changed in the last query
    {
      title: req.body.title, // value used to replace the post's title
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "post with this id not found" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// - delete a post | retrieves & deletes a post by its id
router.delete("/:id", (req, res) => {
  // insomnia displays the number of rows/entries affected by this query
  Post.destroy({
    where: { id: req.params.id },
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "post with this id not found" });
        return;
      }
      res.json(dbPostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
