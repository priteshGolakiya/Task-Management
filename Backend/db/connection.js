const monggose = require("mongoose");

function connect() {
  return monggose.connect(process.env.MONGO_URI);
}

module.exports = connect;
