// Customer error handling
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

// PSQL error handling
exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Missing or invalid key in patch body" });
  } else if (err.code === "23503") {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23505") {
    res.status(409).send({message: "Category already exists"});
  } else next(err);
};

// Server error handling
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
};
