const mongoose = require("mongoose");

const connectToCluster = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = {
  connectToCluster,
};
