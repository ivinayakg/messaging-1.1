const MessageEventWatcher = require("../models/Message").watch();
const ChannelUser = require("../models/Channel_user");
const User = require("../models/User");
const { requestQue, unSubscribe } = require("./pubsub");

module.exports = async function newMessageEmitter() {
  MessageEventWatcher.on("change", async function modelChange(data) {
    if (data.operationType === "insert") {
      let messageDoc = data.fullDocument;
      let allUsersOfThisChannel = (
        await ChannelUser.find({ channelId: messageDoc.channelId.toString() })
      ).map((connection) => connection.userId.toString());

      let messageUser = await User.findOne({ _id: messageDoc.userId });

      messageDoc = { ...messageDoc, userId: messageUser };

      allUsersOfThisChannel.forEach((user) => {
        let userPollRes = requestQue[user];
        if (!userPollRes) return;
        userPollRes
          .status(200)
          .json({ success: true, data: { ...messageDoc } });
        unSubscribe(user._id);
      });
    }
  });
};
