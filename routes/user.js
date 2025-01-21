const express = require("express");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequest } = require("../src/models/connectionRequest");
const { INTERESTED } = require("../src/utils/constants");
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

module.exports = userRouter;
