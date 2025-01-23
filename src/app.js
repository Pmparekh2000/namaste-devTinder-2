const express = require("express");
const cors = require("cors");
const { connectToCluster } = require("../config/database");
const cookieParser = require("cookie-parser");
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

const PORT = 3000;

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

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
