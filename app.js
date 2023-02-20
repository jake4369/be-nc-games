const express = require("express");
const app = express();

const categoriesController = require("./controllers/categoriesController");

app.get("/api/categories", categoriesController.getCategories);

module.exports = app;
