const express = require("express");
const upload = require("../Middleware/uploads");
const userAuth = require("../Middleware/userAuth");
const User = require("../Models/User");

const profileRouter = express.Router();

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

module.exports = profileRouter;

module.exports = profileRouter;
