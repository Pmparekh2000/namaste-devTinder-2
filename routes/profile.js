const express = require("express");
const { userAuth } = require("../middleware/auth");
const { User } = require("../src/models/user");
const { ALLOWED_UPDATES } = require("../src/utils/constants");
const bcrypt = require("bcrypt");

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

profileRouter.patch("/edit/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const currentUser = req.user;
    const isOldPasswordCorrect = await currentUser.validatePassword(
      oldPassword
    );
    if (!isOldPasswordCorrect) {
      throw new Error("Old password does not match with existing password");
    }

    const newEncryptedPassword = await bcrypt.hash(newPassword, 10);

    const updateResponse = await User.findOneAndUpdate(
      { emailId: currentUser.emailId },
      { password: newEncryptedPassword },
      { returnDocument: "after" }
    );

    res
      .status(200)
      .clearCookie("jwtToken")
      .send({
        message: `${currentUser.firstName} password updated successfully. Please login again with new password`,
      });
  } catch (error) {
    res.status(400).send({
      message: "Error while updating user password: " + error.message,
    });
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
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
        "Trying to update restricted field(s) or misspelled field(s) " +
          restrictedKeys.join(", ") +
          ". Fields allowed to be updated are " +
          ALLOWED_UPDATES.join(", ")
      );
    }
    const updatedResponse = await User.findOneAndUpdate(
      { emailId: req.user.emailId },
      { ...requestBody },
      { returnDocument: "after" }
    ).select("firstName lastName age gender photoUrl skills about");

    res.status(200).send({
      message: "User profile updated successfully",
      updatedUser: updatedResponse,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error while updating user profile: " + error.message });
  }
});

module.exports = profileRouter;
