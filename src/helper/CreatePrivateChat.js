const StreamChat = require("stream-chat").StreamChat;
const serverClient = StreamChat.getInstance(
  process.env.STREAM_CHAT_API,
  process.env.STREAM_CHAT_SECRET
);

const CreatePrivateChat = async (toUser, fromUser) => {
  try {
    if (!toUser || !fromUser) {
      throw new Error("User data not found!! while Creating private Chat");
    }

    const channelId = `private-Chat-${fromUser._id}-${toUser._id}`;

    const channel = serverClient.channel("messaging", channelId, {
      name: `${fromUser.userName} & ${toUser.userName}'s Private Chat`,
      members: [toUser._id, fromUser._id],
      created_by_id: fromUser._id.toString(),
      metadata: {
        fromUserName: fromUser.userName,
        toUserName: toUser.userName,
      },
    });

    await channel.create();
    console.log(
      `Private chat created between ${fromUser.fullName} and ${toUser.fullName}`
    );

    return channel;
  } catch (err) {
    console.error("Error creating private chat:", err);
    throw err;
  }
};

const generateToken = async (user) => {
  try {
    if (!user) {
      throw new Error("user not found while generating token");
    }
    await serverClient.upsertUser({
      id: user._id,
      name: user.fullName,
      username: user._userName,
      email: user.email,
      gender: user.gender,
    });
    console.log("user successfully added to chat storage");
    const chattoken = serverClient.createToken(user._id.toString());
    if (!chattoken) {
      throw new Error("failed to generate token");
    }
    return chattoken;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { CreatePrivateChat, generateToken };
