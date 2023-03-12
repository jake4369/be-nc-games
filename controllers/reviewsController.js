const comments = require("../db/data/test-data/comments");
const reviewsModel = require("./../models/reviewsModel");

exports.getReviews = (req, res, next) => {
  const sort_by = req.query.sort_by || "created_at";
  const order = req.query.order || "desc";
  const category = req.query.category || null;
  reviewsModel
    .getReviews(sort_by, order, category)
    .then((reviews) => {
      res.status(200).json({
        results: reviews.length,
        reviews: reviews,
      });
    })
    .catch((error) => {
      next(error);
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
  const { incVotes } = req.body;

  reviewsModel
    .updateReview(reviewId, incVotes)
    .then((review) => {
      res.status(200).json({
        review: review,
      });
    })
    .catch((error) => next(error));
};

exports.addReview = (req, res, next) => {
  const { owner, title, review_body, designer, category, review_img_url } =
    req.body;

  if (!owner || !title || !review_body || !designer || !category) {
    return res.status(400).json({
      message: "Missing required properties",
    });
  }

  reviewsModel
    .addReview(owner, title, review_body, designer, category, review_img_url)
    .then((review) => {
      res.status(201).json({
        review: review,
      });
    })
    .catch((error) => next(error));
};
