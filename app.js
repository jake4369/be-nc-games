const express = require("express");
const app = express();

const categoriesController = require("./controllers/categoriesController");

app.get("/api/categories", categoriesController.getCategories);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

module.exports = app;
