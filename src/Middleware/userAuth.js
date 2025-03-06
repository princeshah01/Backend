const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ msg: "please Login and Try again", success: false });
    }
    const { _id } = await jwt.verify(token, process.env.JWT_SECRET);
    const loginedInuserData = await User.findById(_id).select("+passoword");
    if (!loginedInuserData) {
      return res.status(400).json({ msg: "user not found", success: false });
    }
    req.user = loginedInuserData;
    next();
  } catch (err) {
    console.log(err + " userAuth ka error");
    res.status(400).json({ msg: err.msg, success: false });
  }
};

module.exports = userAuth;
