const express = require("express");
const { connectToCluster } = require("../config/database");
const { User } = require("./models/user");
const { ALLOWED_UPDATES } = require("./utils/constants");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = 3000;

app.post("/signup", async (req, res) => {
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

    res.status(200).send({
      message: `User ${response.firstName} with email ${response.emailId} saved successfully`,
    });
  } catch (error) {
    res.status(500).send({
      message: `Something went wrong while creating user ${firstName}`,
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
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

    res
      .status(200)
      .cookie("jwtToken", jwtToken, { expires: new Date(Date.now() + 35000) })
      .send({
        message: `User ${user.firstName} with email ${user.emailId} logged-in successfully`,
      });
  } catch (error) {
    res.status(500).send({
      message: `Something went wrong while logging-in ${requestBody.emailId}`,
      error: error.message,
    });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res
      .status(200)
      .send({ message: "User profile obtained successfully", user: req.user });
  } catch (error) {
    res.status(500).send({ message: "Somthing went wrong. " + error.message });
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    console.log("Send connection request successfully");
    res.status(200).send({
      message:
        "Connection request sent successfully for user " + req.user.firstName,
    });
  } catch (error) {
    res.status(500).send({
      message: "Connection request sent successfully",
      error: error.message,
    });
  }
});

connectToCluster()
  .then(() => {
    console.log("Successfully connected to mongoDB cluster");
    app.listen(PORT, () => {
      console.log("Listening on port", PORT);
    });
  })
  .catch((err) => {
    console.log("Connection to mongoDB cluster failed", err);
  });
