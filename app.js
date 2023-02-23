const express = require("express");
const app = express();

app.use(express.json());

const categoriesController = require("./controllers/categoriesController");
const reviewsController = require("./controllers/reviewsController");
const errorHandlingController = require("./controllers/errorHandlingController");

app.get("/api/categories", categoriesController.getCategories);

app.get("/api/reviews", reviewsController.getReviews);

app.get("/api/reviews/:reviewId", reviewsController.getReview);

app.get(
  "/api/reviews/:reviewId/comments",
  reviewsController.getCommentsByReviewId
);

app.post(
  "/api/reviews/:reviewId/comments",
  reviewsController.addCommentByReviewId
);

app.patch("/api/reviews/:reviewId", reviewsController.updateReview);

app.all("*", (req, res) => {
  res.status(400).send({ message: "Path not found!" });
});

app.use(errorHandlingController.handleCustomErrors);
app.use(errorHandlingController.handlePsqlErrors);
app.use(errorHandlingController.handleServerErrors);

module.exports = app;
