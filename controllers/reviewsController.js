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
  const { review_id } = req.params;

  reviewsModel
    .getReview(review_id)
    .then((review) => {
      res.status(200).json({
        review: review,
      });
    })
    .catch((error) => next(error));
};

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  reviewsModel
    .getCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).json({
        comments: comments,
      });
    })
    .catch((error) => next(error));
};
