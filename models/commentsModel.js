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
