const express = require("express");
const userAuth = require("../Middleware/userAuth");
const chatRouter = express.Router();

// chat list of user api

chatRouter.get("/chat-list", userAuth, async (req, res) => {
  const user = req.user;
  try {
    data = [
      {
        profilePicture:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsCwG1oEZXQUm14j6zcO38m3ruJKezw56grw&s",
        fullName: "Global Chat Room",
        Messages: null,
        online: false,
      },
    ];
    if (user) {
      res.status(200).json({
        message: "successfully got chat history",
        success: true,
        data,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "failed to fetch chat history",
      success: false,
    });
  }
});

module.exports = chatRouter;
