const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  console.log("Coming inside the first request URL");
  res.send("Hello hello");
});

app.use("/test", (req, res) => {
  console.log("Coming inside the first request URL");
  res.send("Hello from the server");
});

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
