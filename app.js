const express = require("express");
const app = express();

const categoriesController = require("./controllers/categoriesController");
const errorHandlingController = require("./controllers/errorHandlingController");

app.get("/api/categories", categoriesController.getCategories);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

app.use(errorHandlingController.handleServerErrors);

module.exports = app;
