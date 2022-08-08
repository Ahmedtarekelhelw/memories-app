const { generateAccessToken } = require("./auth");
const jwt = require("jsonwebtoken");

const refreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Token is not valid" }); // unauthorized token is not valid (forbidden)
    const newAccessToken = generateAccessToken(decoded.id);
    res.json({ accessToken: newAccessToken });
  });
};

module.exports = { refreshToken };
