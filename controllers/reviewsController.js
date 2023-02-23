const comments = require("../db/data/test-data/comments");
const reviewsModel = require("./../models/reviewsModel");

exports.getReviews = (req, res, next) => {
  reviewsModel
    .getReviews()
    .then((reviews) => {
      res.status(200).json({
        reviews: reviews,
      });
    })
    .catch((error) => next(error));
};

exports.getReview = (req, res, next) => {
  const { reviewId } = req.params;

  reviewsModel
    .getReview(reviewId)
    .then((review) => {
      res.status(200).json({
        review: review,
      });
    })
    .catch((error) => next(error));
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { reviewId } = req.params;

  reviewsModel
    .getCommentsByReviewId(reviewId)
    .then((comments) => {
      res.status(200).json({
        comments: comments,
      });
    })
    .catch((error) => next(error));
};

exports.addCommentByReviewId = (req, res, next) => {
  const { reviewId } = req.params;
  const { username, body } = req.body;

  reviewsModel
    .addCommentByReviewId(reviewId, username, body)
    .then((comment) => {
      res.status(201).json({
        comment: comment,
      });
    })
    .catch((error) => next(error));
};

exports.updateReview = (req, res, next) => {
  const { reviewId } = req.params;
  const { inc_votes } = req.body;

  reviewsModel
    .updateReview(reviewId, inc_votes)
    .then((review) => {
      res.status(200).json({
        review: review,
      });
    })
    .catch((error) => next(error));
};
