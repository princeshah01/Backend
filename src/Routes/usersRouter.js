const express = require("express");
const usersRouter = express.Router();

const userAuth = require("../Middleware/userAuth");
const ConnectionRequest = require("../Models/Connection");
const User = require("../Models/User");

const USER_SAFE_DATA =
  "fullName userName interestIn dob age gender isVerified bio profilePicture twoBestPics locationName interest";

//all pending requests
usersRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName" , ... here we can add any thing we want to populate]);

    res.status(200).json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.statusCode(400).send("ERROR: " + err.message);
  }
});
//all connection
usersRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    // throw new Error("Error hhui hui hui ")
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        const data = {
          _id: row._id,
          userInfo: { ...row.toUserId._doc, isfav: row.isfav },
        };
        return data;
      }
      const data = {
        _id: row._id,
        userInfo: { ...row.fromUserId._doc, isfav: row.isfav },
      };
      return data;
    });

    res.status(200).json({ data, success: true });
  } catch (err) {
    res.status(400).send({ message: err.message, success: false });
  }
});

usersRouter.get("/feed/:page", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.params.page) || 1;
    let limit = 5;
    console.log(page);
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .limit(limit);
    console.log(users.length);
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = usersRouter;
