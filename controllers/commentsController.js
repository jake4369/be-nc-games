const commentsModel = require("../models/commentsModel");

exports.deleteComment = (req, res, next) => {
  const { commentId } = req.params;

  commentsModel
    .deleteComment(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => next(error));
};
