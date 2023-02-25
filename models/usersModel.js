const db = require("./../db/connection");

exports.getUsers = () => {
  return db
    .query(
      `
        SELECT * FROM users;
      `
    )
    .then((results) => {
      const users = results.rows;
      return users;
    });
};

exports.getUser = (username) => {
  return db
    .query(
      `
      SELECT * FROM users
      WHERE username = $1;
    `,
      [username]
    )
    .then((result) => {
      const user = result.rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          message: "User not found",
        });
      }
      return user;
    });
};
