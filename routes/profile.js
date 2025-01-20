const express = require("express");
const { userAuth } = require("../middleware/auth");
const { User } = require("../src/models/user");
const { ALLOWED_UPDATES } = require("../src/utils/constants");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .send({ message: "User profile obtained successfully", user: req.user });
  } catch (error) {
    res.status(500).send({ message: "Somthing went wrong. " + error.message });
  }
});

profileRouter.post("/edit", userAuth, async (req, res) => {
  try {
    const requestBody = req.body;
    const isUpdateAllowed = Object.keys(requestBody).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      const restrictedKeys = Object.keys(requestBody).filter(
        (key) => !ALLOWED_UPDATES.includes(key)
      );
      throw new Error(
        "Trying to update restricted field(s) " + restrictedKeys.join(", ")
      );
    }
    const updateResponse = await User.findOneAndUpdate(
      { emailId: req.user.emailId },
      { ...requestBody },
      { returnDocument: "after" }
    );
    res.status(200).send({
      message: "User profile updated successfully",
      updatedUser: updateResponse,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error while updating user profile: " + error.message });
  }
});

module.exports = profileRouter;
