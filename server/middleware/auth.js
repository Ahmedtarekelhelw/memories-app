const jwt = require("jsonwebtoken");

module.exports.auth = (req, res, next) => {
  //this set by interceptors by axios in front
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader)
    return res.status(401).json({ msg: "You are not authenticated!" });

  const token = authHeader.split(" ")[1];

  //google token is longer than 500
  const notGoogleToken = token.length < 500;

  //this verify access token
  if (token && notGoogleToken) {
    jwt.verify(token, process.env.JWT_KEY, (err, userId) => {
      if (err) return res.status(403).json({ msg: "Token is not valid!" });
      req.userId = userId.id;
      next();
    });
  } else {
    // this to verify google account
    const data = jwt.decode(token);
    req.userId = data?.sub; // sub is the id of user
    next();
  }
};
