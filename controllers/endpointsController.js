const endpointsModel = require("./../models/endpointsModel");

exports.getEndpoints = (req, res, next) => {
  endpointsModel
    .getEndpoints()
    .then((endpoints) => {
      res.status(200).json({
        enpoints: endpoints,
      });
    })
    .catch((error) => {
      next(error);
    });
};
