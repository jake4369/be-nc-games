const express = require("express");
const commentsController = require("./../controllers/commentsController");

const router = express.Router();

router
  .route("/:commentId")
  .patch(commentsController.updateComment)
  .delete(commentsController.deleteComment);

module.exports = router;
