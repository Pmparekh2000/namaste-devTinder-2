const adminAuth = (req, res, next) => {
  const token = "abc";
  const isAuthorized = token === "abc";
  if (!isAuthorized) {
    res.status(401).send({ message: "User not authorized" });
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};
