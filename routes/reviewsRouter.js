const express = require("express");
const reviewsController = require("./../controllers/reviewsController");

const router = express.Router();

router
  .route("/")
  .get(reviewsController.getReviews)
  .post(reviewsController.addReview);

router
  .route("/:reviewId")
  .get(reviewsController.getReview)
  .patch(reviewsController.updateReview)
  .delete(reviewsController.deleteReview);

router
  .route("/:reviewId/comments")
  .get(reviewsController.getCommentsByReviewId)
  .post(reviewsController.addCommentByReviewId);

module.exports = router;
