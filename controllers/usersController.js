const usersModel = require("./../models/usersModel");

exports.getUsers = (req, res, next) => {
  usersModel
    .getUsers()
    .then((users) => {
      res.status(200).json({ users: users });
    })
    .catch((error) => next(error));
};
