const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
