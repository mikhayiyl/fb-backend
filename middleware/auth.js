const config = require(`config`);
const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied!.No token provided");

  try {
    const Key = process.env.KEY || config.get("jwtPrivateKey");
    const decoded = jwt.verify(token, Key);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send(".Invalid token ");
  }
};
