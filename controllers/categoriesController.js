const categoriesModel = require("./../models/categoriesModel");

exports.getCategories = (req, res, next) => {
  categoriesModel
    .getCategories()
    .then((categories) => {
      res.status(200).json({
        results: categories.length,
        categories: categories,
      });
    })
    .catch((error) => next(error));
};
