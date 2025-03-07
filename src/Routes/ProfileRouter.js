const express = require("express");
const upload = require("../Middleware/uploads");
const userAuth = require("../Middleware/userAuth");
const User = require("../Models/User");

const profileRouter = express.Router();

// profile setup

profileRouter.put("/profilesetup", userAuth, upload, async (req, res) => {
  try {
    console.log(req.body);
    const userData = {};
    Object.keys(req.body).forEach((key) => {
      userData[key] = req.body[key];
    });
    const profilePicPath = req.files.profilePicture
      ? `/uploads/${req.files.profilePicture[0].filename}`
      : null;
    const twoBestPicsPaths = req.files.twoBestPics
      ? req.files.twoBestPics.map((file) => `/uploads/${file.filename}`)
      : [];
    const userProfile = {
      ...userData,
      profilePicture: profilePicPath,
      twoBestPics: twoBestPicsPaths,
      interest: JSON.parse(userData.interest),
      locationcoordiantes: JSON.parse(userData.locationcoordiantes),
    };
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
    const profilePicPath = req.files.profilePicture
      ? `/uploads/${req.files.profilePicture[0].filename}`
      : null;
    const existingUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { ...user, ...dataToBeChanged }
    );
    existingUser.save();

    console.log(req.body);
    // console.log(user);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
});

module.exports = profileRouter;
