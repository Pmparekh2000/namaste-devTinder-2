const express = require("express");

const app = express();

app.get("/hello/:userId/:officeId", (req, res) => {
  console.log(req.query);

  console.log(req.params);

  res.send({ message: "Hello from hello URL 123" });
});

app.use("/user", (req, res) => {
  res.send({ message: "Universal user message" });
});

app.get("/user", (req, res) => {
  res.send({ name: "Prerak Parekh", city: "Mumbai" });
});

app.post("/user", (req, res) => {
  res.send({ message: "Successfully post called to user API" });
});

app.delete("/user", (req, res) => {
  res.send({ message: "User deleted successfully" });
});

app.use("/group", (req, res) => {
  res.send({ message: "Universal group message" });
});

app.get("/group", (req, res) => {
  res.send({ name: "Prerak Parekh group", city: "Mumbai group" });
});

app.post("/group", (req, res) => {
  res.send({ message: "Successfully post called to group API" });
});

app.delete("/group", (req, res) => {
  res.send({ message: "Group deleted successfully" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000....");
});
