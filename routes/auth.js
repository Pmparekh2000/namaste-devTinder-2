const express = require("express");
const _ = require("lodash");
const { validateSignUpData } = require("../src/utils/validation");
const bcrypt = require("bcrypt");
const { User } = require("../src/models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    photoUrl,
    about,
    skills,
  } = req.body;
  const newUser = {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    photoUrl,
    about,
    skills,
  };

  try {
    // Validating user input data
    validateSignUpData(req);
    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    newUser.password = encryptedPassword;

    // Creating a new instance of the User model.
    const user = new User(newUser);
    const response = await user.save();

    const jwtToken = await response.getJWT();

    res
      .status(200)
      .cookie("jwtToken", jwtToken, {
        expires: new Date(Date.now() + 35000000000),
      })
      .send({
        message: `User ${response.firstName} with email ${response.emailId} saved successfully`,
        user: user,
      });
  } catch (error) {
    res.status(500).send({
      message: `Something went wrong while creating user ${firstName}`,
      error: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const requestBody = req.body;
  try {
    // Getting user data from mongoDB collection
    const user = await User.findOne({ emailId: requestBody.emailId });
    if (!user) {
      throw new Error("Incorrect credentials for " + requestBody.emailId);
    }

    // Check for password validity
    const result = await user.validatePassword(requestBody.password);
    if (!result) {
      throw new Error("Incorrect credentials for " + requestBody.emailId);
    }

    // Generating a brand new JWT token for the current user
    const jwtToken = user.getJWT();

    // Sending only the relevant data to frontend
    const returnUserData = _.pick(user, [
      "firstName",
      "lastName",
      "emailId",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ]);

    res
      .status(200)
      .cookie("jwtToken", jwtToken, {
        expires: new Date(Date.now() + 35000000000),
      })
      .send({
        message: `User ${user.firstName} with email ${user.emailId} logged-in successfully`,
        user: returnUserData,
      });
  } catch (error) {
    res.status(500).send({
      message: `Something went wrong while logging-in ${requestBody.emailId}`,
      error: error.message,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
      res.status(200).send({ message: "User already logged out" });
    } else {
      res
        .status(200)
        .clearCookie("jwtToken")
        .send({ message: "User logged out successfully" });
    }
  } catch (error) {
    res.status(400).send({
      message: "Error occured while trying to logout " + error.message,
    });
  }
});

module.exports = authRouter;
