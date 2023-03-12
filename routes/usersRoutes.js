const express = require("express");
const usersController = require("./../controllers/usersController");

const router = express.Router();

router.route("/").get(usersController.getUsers);
router.route("/:username").get(usersController.getUser);

module.exports = router;
