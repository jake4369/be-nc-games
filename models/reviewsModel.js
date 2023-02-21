const db = require("./../db/connection");

exports.getReviews = () => {
  return db
    .query(
      `
        SELECT reviews.*, CAST(COUNT(body) AS INT) AS comment_count 
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC
    `
    )
    .then((results) => {
      const reviews = results.rows;
      return reviews;
    });
};

exports.getReview = (review_id) => {
  return db
    .query(
      `
      SELECT * FROM reviews
      WHERE review_id = $1
    `,
      [review_id]
    )
    .then((result) => {
      const review = result.rows[0];
      return review;
    });
};
