const express = require("express");
const { connectToCluster } = require("../config/database");
const { User } = require("./models/user");

const app = express();

app.use(express.json());

const PORT = 3000;

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  const newUser = {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
  };

  try {
    // Creating a new instance of the User model.
    const user = new User(newUser);
    const response = await user.save();

    res.status(200).send({
      message: `User ${response.firstName} with email ${response.emailId} saved successfully`,
    });
  } catch (error) {
    res.status(500).send({
      message: `Something went wrong while creating user ${dummyUser.firstName}`,
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
