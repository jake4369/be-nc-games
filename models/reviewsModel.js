const db = require("./../db/connection");

exports.getReviews = (
  sort_by = "created_at",
  order = "desc",
  category = null
) => {
  const allowedColumns = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
    "comment_count",
  ];
  const allowedOrders = ["asc", "desc"];

  if (!allowedColumns.includes(sort_by) && !allowedOrders.includes(order)) {
    return Promise.reject({
      status: 400,
      message: "Invalid query, please check sort_by and order is correct",
    });
  } else if (!allowedColumns.includes(sort_by)) {
    return Promise.reject({ status: 404, message: "Property does not exist" });
  } else if (!allowedOrders.includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }

  const queryValues = [];
  let queryStr = `
    SELECT reviews.*, CAST(COUNT(body) AS INT) AS comment_count 
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;

  if (category) {
    queryStr += ` WHERE category ILIKE $1`;
    queryValues.push(`%${category}%`);
  }

  queryStr += `
    GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order}
  `;

  return db.query(queryStr, queryValues).then((results) => {
    const reviews = results.rows;
    if (category && reviews.length === 0) {
      return [];
    } else if (reviews.length === 0) {
      return Promise.reject({ status: 404, message: "Not found" });
    } else {
      return reviews;
    }
  });
};

exports.getReview = (reviewId) => {
  return db
    .query(
      `
      SELECT reviews.*, CAST(COUNT(comments.review_id) AS INT) AS comment_count
      FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;
    `,
      [reviewId]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: `Review not found`,
        });
      }
      const review = result.rows[0];
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
    })
    .catch((error) => {
      if (
        error.code === "23503" &&
        error.constraint === "comments_author_fkey"
      ) {
        return Promise.reject({
          status: 400,
          message: "User not found",
        });
      } else {
        return Promise.reject(error);
      }
    });
};

exports.updateReview = (reviewID, incVotes) => {
  return db
    .query(
      `
      UPDATE reviews
      SET
        votes = votes + $1
      WHERE review_id = $2
      RETURNING *;
    `,
      [incVotes, reviewID]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: `Review not found`,
        });
      }
      const review = result.rows[0];
      return review;
    });
};
