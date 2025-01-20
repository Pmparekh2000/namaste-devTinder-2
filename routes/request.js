const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
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

module.exports = requestRouter;
