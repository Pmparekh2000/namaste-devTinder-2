const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OTHERS, MALE, FEMALE } = require("../utils/constants");

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
      enum: {
        values: [MALE, FEMALE, OTHERS],
        message: "{VALUE} is not valid gender",
      },
      isPremium: {
        type: Boolean,
        default: false,
      },
      membershipType: {
        type: String,
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwE-dQ_rGbpeczHXwFfqsUpr43p3fSjNbduQ&s",
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

userSchema.index({ firstName: 1, emailId: 1 });

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign(
    { emailId: user.emailId },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: 3000,
    }
  );
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
