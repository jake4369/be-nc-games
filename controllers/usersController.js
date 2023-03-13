const usersModel = require("./../models/usersModel");

exports.getUsers = (req, res, next) => {
  usersModel
    .getUsers()
    .then((users) => {
      res.status(200).json({
        results: users.length,
        users: users,
      });
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

exports.addUser = (req, res, next) => {
  const { username, name, avatar_url } = req.body;

  usersModel
    .addUser(username, name, avatar_url)
    .then((user) => {
      res.status(201).json({ user: user });
    })
    .catch((error) => {
      next(error);
    });
};
