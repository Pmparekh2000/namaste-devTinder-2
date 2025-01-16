const express = require("express");
const { adminAuth } = require("../middleware/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.status(200).send({ message: "All Data sent" });
});

app.delete("/admin/deleteUser", (req, res) => {
  res.status(200).send({ message: "User deleted successfully" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
