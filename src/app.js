const express = require("express");

const app = express();

app.use(
  "/user",
  [
    (req, res, next) => {
      console.log("Route handler 1");
      next();
    },
    (req, res, next) => {
      console.log("Route handler 2");
      next();
    },
  ],
  (req, res) => {
    console.log("Route handler 3");
    res.send({ message: "Hello" });
  }
);

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
