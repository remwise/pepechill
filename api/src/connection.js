const mongoose = require("mongoose");

const User = require("./models/User.model");

const connection = "mongodb://localhost:27018/mongo-test";

const connectDb = () => {
  return mongoose.connect(connection);
};

module.exports = connectDb;
