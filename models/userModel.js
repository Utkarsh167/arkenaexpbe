const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let users = new Schema({
  fName: {
    type: String
  },
  lName: {
    type: String
  },
  email: {
    type: String
  },
  pNumber: {
    type: String
  },
  pImage: {
    type: String
  }
});

module.exports = mongoose.model("users", users);