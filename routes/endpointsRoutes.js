const express = require("express");
const endpointsController = require("./../controllers/endpointsController");

const router = express.Router();

router.route("/").get(endpointsController.getEndpoints);

module.exports = router;
