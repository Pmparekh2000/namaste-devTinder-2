const express = require("express");

const app = express();

app.get("/getUserData", (req, res) => {
  try {
    throw new Error("Index out of bounds");
    res.status(200).send({ message: "All Data sent" });
  } catch (err) {
    res.status(500).send("Something went wrong 123");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log our error
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
