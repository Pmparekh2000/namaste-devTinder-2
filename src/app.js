const express = require("express");

const app = express();

app.use("/user", (req, res, next) => {
  console.log("Route handler 2");
  next();
});

app.use("/user", (req, res, next) => {
  console.log("Route handler 1");
  next();
});

app.use("/user123", (req, res, next) => {
  console.log("Route handler 123");
  res.send({ message: "Hello 123" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
