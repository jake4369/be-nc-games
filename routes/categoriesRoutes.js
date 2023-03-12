const express = require("express");
const categoriesController = require("./../controllers/categoriesController");

const router = express.Router();

router
  .route("/")
  .get(categoriesController.getCategories)
  .post(categoriesController.addCategory);

module.exports = router;
