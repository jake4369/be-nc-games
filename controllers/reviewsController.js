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
