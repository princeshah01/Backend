const express = require("express");
const { validateSignUp, ValidateLogin } = require("../helper/Validator");
const User = require("../Models/User");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

// signup

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req.body);
    const userInfo = { ...req?.body };
    console.log(userInfo);
    const existingUser = await User.findOne({ email: userInfo.email });
    if (existingUser) {
      throw new Error("user already exist with this email");
    }
    userInfo.password = await bcrypt.hash(userInfo.password, 10);

    const newUser = new User(userInfo);
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: `User registered successfully Now Login And Setup your Profile to Make connections & make sure to click on link we have sent on ${userInfo.email} to get Verified !`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//login

authRouter.post("/login", async (req, res) => {
  const userInfo = req.body;
  console.log(userInfo);
  try {
    ValidateLogin(userInfo);
    const existingUser = await User.findOne({ email: userInfo.email }).select(
      "+password"
    );
    if (!existingUser) {
      throw new Error("Invalid credintials");
    }
    console.dir(existingUser);
    const isPasswordVerified = await existingUser.validatePassword(
      userInfo.password
    );
    if (!isPasswordVerified) {
      throw new Error("Invalid Password");
    }
    const response = existingUser.toObject();
    delete response.password;
    const token = await existingUser.getJWT();
    console.log(token);
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      msg: "login Successfully",
      user: response,
      token: token,
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// forget password

authRouter.post("/forgetPassword", async (req, res) => {
  console.log("ok");
  const { email } = req?.body;
  res.status(200).json({ message: "done", email: email });
});

module.exports = authRouter;
