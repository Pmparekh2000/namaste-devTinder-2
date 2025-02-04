require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToCluster } = require("../config/database");
const cookieParser = require("cookie-parser");
require("./utils/cron-job");
const authRouter = require("../routes/auth");
const profileRouter = require("../routes/profile");
const requestRouter = require("../routes/request");
const userRouter = require("../routes/user");

const app = express();

const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

connectToCluster()
  .then(() => {
    console.log("Successfully connected to mongoDB cluster");
    app.listen(process.env.PORT, () => {
      console.log("Listening on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Connection to mongoDB cluster failed", err);
  });
