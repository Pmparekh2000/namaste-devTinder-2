const express = require("express");
const { connectToCluster } = require("../config/database");

const app = express();
const PORT = 3000;

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
