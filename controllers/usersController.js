const usersModel = require("./../models/usersModel");

exports.getUsers = (req, res, next) => {
  usersModel
    .getUsers()
    .then((users) => {
      res.status(200).json({ users: users });
    })
    .catch((error) => next(error));
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  usersModel
    .getUser(username)
    .then((user) => {
      res.status(200).json({
        user: user,
      });
    })
    .catch((error) => next(error));
};
