const express = require("express");
const { validateSignUp, ValidateLogin } = require("../helper/Validator");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const generateOtp = require("../helper/generateOtp");
const authRouter = express.Router();
const OTP = require("../Models/Otp");
const mailSender = require("../helper/mailSender");
const { encode: btoa } = require("base-64");
const { generateToken } = require("../helper/CreatePrivateChat");
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
    const otp = generateOtp();
    const Otp = new OTP({ email: userInfo.email, otp });
    await Otp.save();
    // enable mailsender
    mailSender(userInfo.email, otp);

    console.log(" ~ authRouter.post ~ otp:", otp);
    const newUser = new User(userInfo);
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: `OTP has been sent to ${newUser.email}`,
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//login

authRouter.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: "user not found with this email", success: false });
      return;
    }
    await OTP.deleteOne({ email });
    const newOtp = new OTP({ email, otp });
    await newOtp.save();
    mailSender(newOtp.email, newOtp.otp);

    // send email here
    console.log("~ authRouter.post ~ otp:", otp);
    res.status(200).json({ success: true, message: "OTP Sent successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "server Error" });
  }
});

//otp verify

authRouter.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  try {
    if (!email && !otp) {
      return res.status(400).json({ message: "no OTP entered" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const existingOtp = await OTP.findOne({ email });

    console.log("🚀 ~ authRouter.post ~ existingOtp:", existingOtp);
    if (!existingOtp) {
      return res.status(400).json({ message: "OTP expired or Not Found" });
    }

    if (existingOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).json({ message: "OTP verified Done" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message || "server Error" });
  }
});

authRouter.post("/login", async (req, res) => {
  const userInfo = req.body;
  console.log(userInfo);
  try {
    ValidateLogin(userInfo);
    const existingUser = await User.findOne({ email: userInfo.email }).select(
      "+password"
    );
    if (!existingUser) {
      throw new Error("User not found");
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
    const chatToken = await generateToken(existingUser);
    res.cookie("token", token);
    res.status(200).json({
      success: true,
      msg: "login Successfully",
      user: response,
      token: token,
      chatToken,
      streamApiKey: btoa(
        process.env.STREAM_CHAT_API + process.env.ENCODE_SECRET
      ),
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
