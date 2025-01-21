const express = require("express");
const { userAuth } = require("../middleware/auth");
const { User } = require("../src/models/user");
const { ConnectionRequest } = require("../src/models/connectionRequest");
const {
  ALLOWED_STATUS,
  INTERESTED,
  ALLOWED_ACTIONS,
} = require("../src/utils/constants");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  const { status, toUserId } = req.params;

  try {
    if (!ALLOWED_STATUS.includes(status)) {
      throw new Error("Invalid status type " + status);
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error("User does not exist");
    }
    const fromUser = req.user;

    const newConnectionRequest = {
      fromUserId: fromUser._id,
      toUserId: toUser._id,
      status,
    };

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUser._id, toUserId: toUser._id },
        { fromUserId: toUser._id, toUserId: fromUser._id },
      ],
    });

    // if (toUser._id.toString() == fromUser._id.toString()) {
    //   throw new Error("Cannot send connection request to self");
    // }
    if (existingConnectionRequest) {
      throw new Error(
        "Request already exists between " +
          fromUser.firstName +
          " and " +
          toUser.firstName
      );
    }

    const connectionRequest = new ConnectionRequest(newConnectionRequest);
    const connectionRequestResponse = await connectionRequest.save();

    if (status === INTERESTED) {
      res.status(200).send({
        message:
          "Connection request sent successfully to user " + toUser.firstName,
      });
    } else {
      res.status(200).send({
        message: "Successfully ignored user " + toUser.firstName,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Connection request failed to send",
      error: error.message,
    });
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  const { status, requestId } = req.params;
  try {
    if (!ALLOWED_ACTIONS.includes(status)) {
      throw new Error("Invalid status attribute");
    }
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: INTERESTED.toLowerCase(),
    });

    if (!connectionRequest) {
      throw new Error("Connection request not found");
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.status(200).send({
      message: data,
    });
  } catch (error) {
    res.status(500).send({
      message: "Connection request failed: ",
      error: error.message,
    });
  }
});

module.exports = requestRouter;
