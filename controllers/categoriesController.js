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

exports.addCategory = (req, res, next) => {
  const { slug, description } = req.body;

  if (!slug || !description) {
    return res.status(400).json({
      message: "Both 'slug' and 'description' keys are required.",
    });
  }

  categoriesModel
    .addCategory(slug, description)
    .then((category) => {
      res.status(201).json({
        category: category,
      });
    })
    .catch((error) => next(error));
};
