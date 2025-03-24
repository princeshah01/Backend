const express = require("express");
const userAuth = require("../Middleware/userAuth");
const chatRouter = express.Router();
const StreamChat = require("stream-chat").StreamChat;
const serverClient = StreamChat.getInstance(
  process.env.STREAM_CHAT_API,
  process.env.STREAM_CHAT_SECRET
);

const AdminId = process.env.ADMIN_ID;

// chat list of user api

chatRouter.get("/join-stream", userAuth, async (req, res) => {
  const { _id, userName, email, gender } = req.user;
  try {
    if (!userName) {
      throw new Error("invalid credentials");
    }
    await serverClient.upsertUser({
      id: _id,
      name: userName || "Anonymous",
      email: email,
      gender: gender,
    });
    res
      .status(200)
      .json({ success: "true", message: "your where added to getStream" });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

chatRouter.get("/join-global-chat", userAuth, async (req, res) => {
  const userId = req?.user?._id;
  try {
    if (!userId) {
      throw new Error("Invalid credentials");
    }
    const chatToken = serverClient.createToken(userId.toString());
    const channel = serverClient.channel("livestream", "global-room", {
      name: "Global Chat Room",
      created_by_id: AdminId,
    });
    await channel.create();
    console.log(AdminId);
    await channel.addMembers([userId, AdminId]);

    if (!channel) {
      throw new Error("Error While Joining Global Chat Room");
    }
    res.status(201).json({
      chatToken,
      channelId: channel.id,
      apiKey: process.env.STREAM_CHAT_API,
      message: "Successfully Joined Global Chat",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error?.message || "SomeThing went Wrong",
      success: false,
    });
  }
});

chatRouter.get("/user/channels", userAuth, async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // Query Stream Chat for channels where the user is a member
    const channels = await serverClient.queryChannels(
      { members: { $in: [userId] } }, // Filters only channels the user is in
      { last_message_at: -1 }, // Sort by last message time
      { watch: true, state: true }
    );

    res.status(200).json({
      success: true,
      channels: channels.map((channel) => ({
        id: channel.id,
        name: channel.data.name,
        members: channel.state.members,
        lastMessage:
          channel.state.messages[channel.state.messages.length - 1] ||
          "something",
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = chatRouter;
