const categoriesModel = require("./../models/categoriesModel");

exports.getCategories = (req, res) => {
  categoriesModel.getCategories().then((categories) => {
    res.status(200).json({
      categories: categories,
    });
  });
};
