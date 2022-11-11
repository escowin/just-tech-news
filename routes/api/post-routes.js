const router = require("express").Router();
const { Post, User } = require("../../models");

// get all posts | retrieves all posts in the database
router.get("/", (req, res) => {
  console.log("===========");
  Post.findAll({
    // query config
    attributes: ["id", "post_url", "title", "created_at"],
    include: [
        {
            model: User,
            attributes: ["username"]
        }
    ],
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// get a post | retrieves a post by its id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id // retrieves id value
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'no post found with this id '});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// pause 13.3.6 create a post

module.exports = router;