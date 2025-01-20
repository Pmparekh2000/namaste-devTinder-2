const express = require("express");
const { connectToCluster } = require("../config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const requestRouter = require("../routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = 3000;

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
