const comments = require("../db/data/test-data/comments");
const reviewsModel = require("./../models/reviewsModel");

exports.getReviews = (req, res, next) => {
  const sort_by = req.query.sort_by || "created_at";
  const order = req.query.order || "desc";
  const category = req.query.category || null;
  reviewsModel
    .getReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).json({ reviews: reviews });
    })
    .catch((error) => {
      if (error.status === 400) {
        res.status(400).send({ message: error.message });
      } else {
        next(error);
      }
    });
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

  if (inc_votes && typeof inc_votes !== "number") {
    return next({
      status: 400,
      message: "Invalid data type for inc_votes",
    });
  }

  reviewsModel
    .updateReview(reviewId, inc_votes)
    .then((review) => {
      res.status(200).json({
        review: review,
      });
    })
    .catch((error) => next(error));
};
