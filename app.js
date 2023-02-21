const express = require("express");
const app = express();

const categoriesController = require("./controllers/categoriesController");
const reviewsController = require("./controllers/reviewsController");
const errorHandlingController = require("./controllers/errorHandlingController");

app.get("/api/categories", categoriesController.getCategories);

app.get("/api/reviews", reviewsController.getReviews);

app.get("/api/reviews/:review_id", reviewsController.getReview);

app.get(
  "/api/reviews/:review_id/comments",
  reviewsController.getCommentsByReviewId
);

app.all("*", (req, res) => {
  res.status(400).send({ message: "Path not found!" });
});

app.use(errorHandlingController.handleCustomErrors);
app.use(errorHandlingController.handlePsqlErrors);
app.use(errorHandlingController.handleServerErrors);

module.exports = app;
