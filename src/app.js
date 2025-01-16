const express = require("express");
const { connectToCluster } = require("../config/database");
const { User } = require("./models/user");

const app = express();
const PORT = 3000;

app.post("/signup", async (req, res) => {
  const dummyUser = {
    firstName: "Hiten",
    lastName: "Parekh",
    emailId: "hpp.tech@gmail.com",
    password: "987654321",
    age: 52,
    gender: "female",
  };

  try {
    // Creating a new instance of the User model.
    const user = new User(dummyUser);
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
