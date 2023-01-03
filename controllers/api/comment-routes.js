const router = require("express").Router();
const { Comment, Post } = require("../../models");
const withAuth = require("../../utils/auth"); // authguards non-get routes

// CRUD operations
// route | /api/comments
router.get("/", (req, res) => {
  Comment.findAll()
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", withAuth, (req, res) => {
  // when logged in
  if (req.session) {
   Comment.create({
    comment_text: req.body.comment_text,
    post_id: req.body.post_id,
    // session id
    user_id: req.session.user_id
   }) 
   .then((dbCommentData) => res.json(dbCommentData))
   .catch((err) => {
     console.log(err);
     res.status(400).json(err);
   });
  }
});

router.delete("/:id", withAuth, (req, res) => {
  Post.destroy({
    where: { id: req.params.id },
  })
    .then((dbCommentData) => {
      if (!dbCommentData) {
        res.status(404).json({ message: "comment with this id not found" });
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
