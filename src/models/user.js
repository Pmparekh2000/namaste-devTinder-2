const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

// Whatever is the name of the collection, make it Singular and make the first letter capital.
// That is the name of the model.
// Mongoose will automatically look for the plural and lowercased version of the model name
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
