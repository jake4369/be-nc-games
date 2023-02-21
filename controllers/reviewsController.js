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
      if (!review) {
        return res.status(204).json({ message: undefined });
      }
      res.status(200).json({
        review: review,
      });
    })
    .catch((error) => next(error));
};
