exports.handleServerErrors = (error, request, response, next) => {
  console.error(err);
  response.status(500).send({ msg: "Internal Server Error" });
};
