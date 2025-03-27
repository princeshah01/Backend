const StreamChat = require("stream-chat").StreamChat;
const serverClient = StreamChat.getInstance(
  process.env.STREAM_CHAT_API,
  process.env.STREAM_CHAT_SECRET
);

const CreatePrivateChat = async (toUser, fromUser, connectionId) => {
  try {
    if (!toUser || !fromUser || !connectionId) {
      throw new Error("User data not found!! while Creating private Chat");
    }

    const channelId = `${connectionId}`;

    const channel = serverClient.channel("messaging", channelId, {
      name: `${connectionId} - Private Chat`,
      members: [toUser._id, fromUser._id],
      created_by_id: fromUser._id.toString(),
      metadata: [
        {
          username: fromUser.fullName,
          profilePicture: fromUser.profilePicture,
        },
        {
          username: toUser.fullName,
          profilePicture: toUser.profilePicture,
        },
      ],
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
      profileImage: user.profilePicture,
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
function cyclicReplacer() {
  const seen = new WeakSet(); // WeakSet is ideal for tracking objects and their references

  return function (key, value) {
    if (typeof value === "object" && value !== null) {
      // If the object has been seen before, return a placeholder
      if (seen.has(value)) {
        return "[Circular]"; // You can replace with any placeholder like '[Circular]'
      }
      // Otherwise, add the object to the set of seen objects
      seen.add(value);
    }
    return value; // Return the value (either the object or primitive)
  };
}
const getChannels = async (channelId, idx) => {
  console.log(channelId);
  try {
    if (!channelId) {
      throw new Error("User Id not Valid");
    }
    const filter = {
      id: channelId,
    };
    const sort = [{ last_message_at: -1 }];
    channel = await serverClient.queryChannels(filter, sort, {
      watch: true,
      state: true,
    });
    console.log(channel[0].data.name);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { CreatePrivateChat, generateToken, getChannels };
