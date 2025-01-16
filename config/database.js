const mongoose = require("mongoose");

const connectToCluster = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:admin@prerakcluster.tq5ia.mongodb.net/?retryWrites=true&w=majority&appName=Prerakcluster/devTinder3"
  );
};

module.exports = {
  connectToCluster,
};
