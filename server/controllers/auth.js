const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "5m" });
};
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "1d" });
};

const register = async (req, res, next) => {
  const { firstName, lastName, email, password, password2 } = req.body;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await User.findOne({ email });
    if (user) return res.status(409).json({ msg: "This Email already exists" }); //conflict

    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters" });

    if (password !== password2)
      return res.status(400).json({ msg: "Password doesn't match" });

    const newUser = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hash,
    });

    const accessToken = generateAccessToken(newUser._id); //short time
    const refreshToken = generateRefreshToken(newUser._id);

    newUser.refreshToken = refreshToken; // long time
    await newUser.save();

    const { refreshToken: Indb, password: userPass, ...other } = newUser._doc;

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ ...other, accessToken });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not registered" });

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword)
      return res.status(400).json({ msg: "Password incorrect" });

    const accessToken = generateAccessToken(user._id); //short time
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken; // long time
    await user.save();

    const { refreshToken: Indb, password: userPass, ...other } = user._doc;
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ ...other, accessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { jwt } = req.cookies;
  try {
    if (!jwt) return res.sendStatus(204); // no content
    const refreshToken = jwt;

    //check if the refresh token accosiated with user in db
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, generateAccessToken, logout };
