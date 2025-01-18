const express = require("express");
const { connectToCluster } = require("../config/database");
const { User } = require("./models/user");
const { ALLOWED_UPDATES } = require("./utils/constants");

const app = express();

app.use(express.json());

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

app.get("/user", async (req, res) => {
  const { userProp, filterBy } = req.query;
  try {
    const user = await User.findOne({ [filterBy]: userProp });
    if (user === null) {
      throw new Error("No such user found");
    }
    res.status(200).send({
      message: `User ${user.firstName} obtained successfully`,
      user: user,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong while getting user",
      error: error.message,
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find({});
    const filteredUsers = allUsers.map((user) => user.firstName);
    res.status(200).send({
      message: "All users obtained successfully",
      users: filteredUsers,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong while getting all users",
      error: error.message,
    });
  }
});

app.delete("/user", async (req, res) => {
  const { userProp, deleteBy } = req.query;
  try {
    const deleteResponse = await User.deleteOne({ [deleteBy]: userProp });
    if (deleteResponse.deletedCount === 0) {
      throw new Error("No such user found");
    }
    res.status(200).send({
      message: `User ${userProp} deleted successfully`,
      user: deleteResponse,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong while deleting user",
      error: error.message,
    });
  }
});

app.put("/user", async (req, res) => {
  const { userProp, findBy } = req.query;
  const updateBody = req.body;
  try {
    const updateBodyKeys = Object.keys(updateBody);
    const allowedUpdates = updateBodyKeys.every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!allowedUpdates) {
      const restrictedKeys = updateBodyKeys.filter(
        (key) => !ALLOWED_UPDATES.includes(key)
      );
      throw new Error(
        "Updating restricted fields " +
          restrictedKeys.join(", ") +
          " not allowed"
      );
    }
    if (updateBody?.skills.length > 10) {
      throw new Error("Skills cannot be more then 10.");
    }
    const updateResponse = await User.findOneAndUpdate(
      { [findBy]: userProp },
      updateBody,
      { returnDocument: "after", lean: true, runValidators: true }
    );

    res.status(200).send({
      message: `User ${userProp} updated successfully`,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong while updating the user",
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
