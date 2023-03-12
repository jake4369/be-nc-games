const express = require("express");
const cors = require("cors");
const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// CONTROLLERS
const errorHandlingController = require("./controllers/errorHandlingController");

// ROUTES
const endpointsRouter = require("./routes/endpointsRoutes");
const categoriesRouter = require("./routes/categoriesRoutes");
const commentsRouter = require("./routes/commentsRoutes");
const reviewsRouter = require("./routes/reviewsRouter");
const usersRouter = require("./routes/usersRoutes");

// ENDPOINTS
app.use("/api", endpointsRouter);

// CATEGORIES
app.use("/api/categories", categoriesRouter);

// COMMENTS
app.use("/api/comments", commentsRouter);

// REVIEWS
app.use("/api/reviews", reviewsRouter);

// USERS
app.use("/api/users", usersRouter);

// All routes
app.all("*", (req, res) => {
  res.status(400).send({ message: "Path not found!" });
});

// ERROR HANDLING MIDDLEWARE
app.use(errorHandlingController.handleCustomErrors);
app.use(errorHandlingController.handlePsqlErrors);
app.use(errorHandlingController.handleServerErrors);

module.exports = app;
