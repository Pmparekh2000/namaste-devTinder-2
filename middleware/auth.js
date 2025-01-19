const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { jwtToken } = req.cookies;
    if (!jwtToken) {
      throw new Error("Token is missing. Please log in again");
    }
    // Validating if the cookie is a valid cookie
    const { emailId } = jwt.verify(jwtToken, "privateKey");
    req.emailId = emailId;
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
