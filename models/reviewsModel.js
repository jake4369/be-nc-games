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

exports.getReview = (reviewId) => {
  return db
    .query(
      `
      SELECT * FROM reviews
      WHERE review_id = $1
    `,
      [reviewId]
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review || review.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Review not found`,
        });
      }
      return review;
    });
};

exports.getCommentsByReviewId = (reviewId) => {
  return db
    .query(
      `
      SELECT * FROM comments
      WHERE review_id = $1
      ORDER BY comments.created_at DESC;
    `,
      [reviewId]
    )
    .then((results) => {
      const comments = results.rows;
      return comments;
    });
};

exports.addCommentByReviewId = (reviewId, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: "Author or body is missing",
    });
  }
  return db
    .query(
      `
      INSERT INTO comments
        (review_id, author, body)
      VALUES
        ($1, $2, $3)
      RETURNING *;
    `,
      [reviewId, username, body]
    )
    .then((result) => {
      const comment = result.rows[0];
      return comment;
    });
};
