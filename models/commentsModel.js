const db = require("./../db/connection");

exports.deleteComment = (commentId) => {
  return db
    .query(
      `
          DELETE FROM comments
          WHERE comment_id = $1
          RETURNING *
      `,
      [commentId]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment not found",
        });
      }
      const comment = result.rows[0];
      return comment;
    });
};

exports.updateComment = (incVotes, commentId) => {
  return db
    .query(
      `
      UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *;
    `,
      [incVotes, commentId]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: `Comment not found`,
        });
      }
      const review = result.rows[0];
      return review;
    });
};
