const jwt = require("jsonwebtoken");
const { User } = require("../src/models/user");

const userAuth = async (req, res, next) => {
  try {
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
      throw new Error("Token is missing. Please log in again");
    }
    // Validating if the cookie is a valid cookie
    const { emailId } = jwt.verify(jwtToken, "privateKey");
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res
        .status(401)
        .send({ message: "User session expired. Please log in again" });
    } else {
      res.status(401).send({ message: error.message });
    }
  }
};

module.exports = {
  userAuth,
};
