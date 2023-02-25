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

exports.updateComment = (req, res, next) => {
  const { commentId } = req.params;
  const { incVotes } = req.body;

  commentsModel
    .updateComment(incVotes, commentId)
    .then((comment) => {
      res.status(200).json({
        comment: comment,
      });
    })
    .catch((error) => next(error));
};
