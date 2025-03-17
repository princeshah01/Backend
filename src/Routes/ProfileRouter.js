const express = require("express");
const upload = require("../Middleware/uploads");
const userAuth = require("../Middleware/userAuth");
const User = require("../Models/User");

const profileRouter = express.Router();

// profile setup
profileRouter.put("/profilesetup", userAuth, upload, async (req, res) => {
  try {
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
      profilePicture: process.env.API_BASE_URI + profilePicPath,
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
  console.log(req.body)
  const dataToBeChanged = req.body;
  const allowedUpdate = [
    "fullName",
    "gender",
    "locationName",
    "locationcoordinates",
    "dob",
    "profilePicture",
    "bio",
  ];
  try {
    for (const key in dataToBeChanged) {
      if (!allowedUpdate.includes(key))
        return res.status(401).json({
          message: "You're trying to edit a field that is not allowed",
          success: false,
        });
      if (dataToBeChanged[key].trim() === "") {
        return res.status(400).json({ message: `${key.toLowerCase()} is a required field can't be null`, success: false })
      }
    }
    const profilePicPath = req.files.profilePicture
      ? `/uploads/${req.files.profilePicture[0].filename}`
      : null;
    const updatedData = { ...dataToBeChanged };
    if (profilePicPath) {
      updatedData.profilePicture = process.env.API_BASE_URI + profilePicPath;
    }
    if (updatedData.locationcoordiantes) {

      updatedData.locationcoordinates = JSON.parse(updatedData?.locationcoordinates)
    }
    console.log(updatedData)
    const existingUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { ...updatedData },
      { new: true }
    );
    console.log(existingUser)
    res.status(200).json({
      message: "Profile updated successfully!",
      existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// get user info

profileRouter.get("/profile/info", userAuth, async (req, res) => {
  const userInfo = req.user;
  try {
    if (!userInfo) {
      return res.status(401).json({ message: "Failed to retrieve userInfo", success: false });
    }
    res.status(200).json({ message: "Successfully retrieved userInfo", success: true, userInfo });

  } catch (err) {
    res.status(500).json({ message: err.message || "An error occurred while retrieving userInfo", success: false });
  }
});
module.exports = profileRouter;
