const mongoose = require("mongoose");
const {
  INTERESTED,
  IGNORED,
  ACCEPTED,
  REJECTED,
} = require("../utils/constants");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: [INTERESTED, IGNORED, ACCEPTED, REJECTED],
        message: "{VALUE} is not supported",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Creating a compound index on both fromUserId and toUserId
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Checking if there is no circular connection request
  if (
    connectionRequest.fromUserId._id.toString() ===
    connectionRequest.toUserId._id.toString()
  ) {
    throw new Error("From and to User ids cannot be same");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = { ConnectionRequest };
