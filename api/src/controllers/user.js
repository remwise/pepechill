const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const User = require("../models/User.model");

router.post("/", jsonParser, async (req, res, next) => {
  const username = req.body?.username;

  if (username) {
    const user = await User.findOne({ username });

    if (user) {
      res.send({
        userId: user._id,
        username: user.username,
      });
      return;
    }

    const newUser = new User({ username });

    try {
      await newUser.save().then(() => console.log(`User ${username} created`));
      res.send({
        userId: user._id,
        username: user.username,
      });
      return;
    } catch (error) {
      console.log("error :>> ", error);
      res.status(500).send("Error!");
    }
  }
  console.log("empty username");
  res.status(500).send("Error!");
});

module.exports = router;
