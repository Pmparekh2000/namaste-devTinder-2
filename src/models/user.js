const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Firstname of the user is required"],
      minLength: [3, "Please enter name more then 3 characters"],
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (emailId) => {
          return validator.isEmail(emailId);
        },
        message: "Invalid email id. Please plug in a valid email id",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (password) => {
          return validator.isStrongPassword(password);
        },
        message: "Password length must be 9 digits and it must be strong",
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      validate: {
        validator: (genderValue) => {
          return ["male", "female", "others"].includes(genderValue);
        },
        message: "Gender can be either of male, female or others",
      },
    },
    photoUrl: {
      type: String,
      default:
        "data:image/jpeg;base64,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",
      validate: {
        validator: (photoUrl) => {
          return validator.isURL(photoUrl);
        },
        message: "Invalid photo URL",
      },
    },
    about: {
      type: String,
      maxLength: 100,
      default: "This is a default about of the user",
    },
    skills: {
      type: [String],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ emailId: user.emailId }, "privateKey", {
    expiresIn: 30,
  });
  return token;
};

userSchema.methods.validatePassword = async function (userProvidedPassword) {
  const user = this;
  const passwordValidity = await bcrypt.compare(
    userProvidedPassword,
    user.password
  );
  return passwordValidity;
};

// Whatever is the name of the collection, make it Singular and make the first letter capital.
// That is the name of the model.
// Mongoose will automatically look for the plural and lowercased version of the model name
const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
