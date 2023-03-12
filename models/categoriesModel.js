const db = require("./../db/connection");

exports.getCategories = () => {
  return db
    .query(
      `
    SELECT * FROM categories;
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

exports.addCategory = (slug, description) => {
  return db
    .query(
      `
      INSERT INTO categories
        (slug, description)
      VALUES
        ($1, $2)
      RETURNING *;
    `,
      [slug, description]
    )
    .then((results) => {
      const category = results.rows[0];
      return category;
    });
};
