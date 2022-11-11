const router = require("express").Router();
const { Post, User } = require("../../models");

// get all users | retrieves all posts in database
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

module.exports = router;