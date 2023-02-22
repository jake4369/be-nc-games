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
