const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequest } = require("../src/models/connectionRequest");
const { INTERESTED, ACCEPTED } = require("../src/utils/constants");
const { User } = require("../src/models/user");
const userRouter = express.Router();

// Get all the pending connection requests for the logged in user
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingConnectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: INTERESTED.toLowerCase(),
    }).populate("fromUserId", "firstName lastName age gender photoUrl skills");
    res.status(200).send({
      message: "All pending connection requests are : ",
      pendingConnectionRequests: pendingConnectionRequests,
    });
  } catch (error) {
    res.status(400).send({
      message:
        "Something went wrong while fetching all pending connection requests",
      error: error.message,
    });
  }
});

// Get all of my existing connections
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const acceptedConnectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: ACCEPTED.toLowerCase(),
        },
        {
          fromUserId: loggedInUser._id,
          status: ACCEPTED.toLowerCase(),
        },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "photoUrl",
        "gender",
        "skills",
      ])
      .populate("toUserId", ["firstName", "lastName", "photoUrl"]);

    // Just filtering out data of connections
    const data = acceptedConnectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).send({
      message: "All of your connections are : ",
      connections: data,
    });
  } catch (error) {
    res.status(400).send({
      message:
        "Something went wrong while fetching all of your existing connections",
      error: error.message,
    });
  }
});

// Get the feed of the current user
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Find all connection request either I have sent or received
    const loggedInUserConnections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    loggedInUserConnections.map((loggedInUserConnection) => {
      hideUsersFromFeed.add(loggedInUserConnection.toUserId.toString());
      hideUsersFromFeed.add(loggedInUserConnection.fromUserId.toString());
    });

    // Below second $ne condition is required since for the first time login user
    // there would be no connection and hence the hideUsersFromFeed set will be empty
    const userFeedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    });
    res.status(200).send({
      message: "All available users in our db are",
      count: userFeedData.length,
      users: userFeedData,
    });
  } catch (error) {
    res.status(400).send({
      message:
        "Something went wrong while fetching all of your existing connections",
      error: error.message,
    });
  }
});

module.exports = userRouter;
