const express = require("express");
const upload = require("../Middleware/uploads");
const userAuth = require("../Middleware/userAuth");
const User = require("../Models/User");
const { generateToken } = require("../helper/CreatePrivateChat");
const profileRouter = express.Router();
const { encode: btoa } = require("base-64");

// profile setup

profileRouter.put("/profilesetup", userAuth, upload, async (req, res) => {
  try {
    console.log(req.body);
    const userData = {};
    Object.keys(req.body).forEach((key) => {
      userData[key] = req.body[key];
    });
    const profilePicPath = req.files.profilePicture
      ? `${process.env.API_BASE_URI}/uploads/${req.files.profilePicture[0].filename}`
      : null;
    const twoBestPicsPaths = req.files.twoBestPics
      ? req.files.twoBestPics.map(
          (file) => `${process.env.API_BASE_URI}/uploads/${file.filename}`
        )
      : [];
    const userProfile = {
      ...userData,
      profilePicture: profilePicPath,
      twoBestPics: twoBestPicsPaths,
      interest: JSON.parse(userData.interest),
      locationcoordiantes: JSON.parse(userData.locationcoordiantes),
    };
    const age = new Date().getFullYear() - new Date(userData.dob).getFullYear();
    userProfile.age = age;
    console.log(userProfile);
    const UserProfileSetup = await User.findByIdAndUpdate(
      {
        _id: req?.user?._id,
      },
      { ...userProfile, isProfileSetup: true },
      { new: true }
    );

    res.status(200).json({
      message: "Profile setup successful!",
      UserProfileSetup,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

profileRouter.patch("/profile/edit", userAuth, upload, async (req, res) => {
  const user = req?.user;
  const dataToBeChanged = req.body;
  const allowedUpdate = [
    "fullName",
    "gender",
    "locationName",
    "dob",
    "profilePicture",
    "bio",
  ];
  try {
    for (const key in dataToBeChanged) {
      if (!allowedUpdate.includes(key))
        return res.status(401).json({
          message: "your are trying to edit field which is not allowed",
          success: false,
        });
    }
    const profilePicPath = `${process.env.API_BASE_URI}/uploads/${req.files.profilePicture[0].filename}`;
    if (profilePicPath) {
      dataToBeChanged.profilePicture = profilePicPath;
    }
    console.log("🚀 ~ profileRouter.patch ~ dataToBeChanged:", dataToBeChanged);

    const existingUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { ...dataToBeChanged },
      {
        new: true,
      }
    );
    existingUser.save();

    console.log(existingUser);
    // console.log(user);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
});

/// to create profile/info

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    // console.log(user) ;
    chatToken = await generateToken(user);
    streamChatApi = btoa(
      process.env.STREAM_CHAT_API + process.env.ENCODE_SECRET
    );
    res.status(200).json({
      user,
      chatToken: chatToken,
      message: "details fetched done",
      success: true,
    });
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
});

module.exports = profileRouter;
