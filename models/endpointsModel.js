const fs = require("fs/promises");

exports.getEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf8")
    .then((endpoints) => {
      return JSON.parse(endpoints);
    });
};
