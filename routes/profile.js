const express = require("express");
const { userAuth } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .send({ message: "User profile obtained successfully", user: req.user });
  } catch (error) {
    res.status(500).send({ message: "Somthing went wrong. " + error.message });
  }
});

module.exports = profileRouter;
