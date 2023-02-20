const db = require("./../db");

exports.getCategories = () => {
  return db
    .query(
      `
    SELECT * FROM categories
  `
    )
    .then((results) => {
      const categories = results.rows;
      return categories;
    })
    .catch((error) => {
      return { error: "Unable to retrieve categories from the database" };
    });
};
