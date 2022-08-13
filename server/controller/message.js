const ChannelUser = require("../models/Channel_user");
const Channel = require("../models/Channel");
const Message = require("../models/Message");
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../error");
const { subscribe, requestQue, unSubscribe } = require("../utils/pubsub");

const addMessage = async (req, res) => {
  const { _id: userId } = req.user;
  const { message, channelId } = req.body;
  try {
    const newMessage = new Message({ message, channelId, userId });
    await newMessage.save();
    return res.status(StatusCodes.ACCEPTED).json({ success: true });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

const getAllMessages = async (req, res) => {
  const { channelId } = req.params;
  let { limit, before } = req.query;
  if (!limit) limit = 10;

  try {
    let lastMessage = (await Message.findOne({ channelId, _id: before })) ?? {};

    const allMessages = await Message.find({
      channelId,
      createdAt: {
        $lt: lastMessage.createdAt ? lastMessage.createdAt : new Date(),
      },
    })
      .limit(Number(limit))
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "userId",
        select: ["email", "username"],
      });

    return res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, data: { allMessages } });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

const getAllUserMessages = async (req, res) => {
  const { userId } = req.body;
  try {
    const allUserChannels = await ChannelUser.find({ userId });
    const allMessages = await Message.find({ channelId });
    return res
      .send(StatusCodes.ACCEPTED)
      .json({ success: true, data: { allMessages } });
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, error: error.message });
  }
};

// const deleteMessage = async (req, res) => {
//   const { _id: userId } = req.user;
//   const { messageId } = req.body;

//   const messageExists = await Message.findOne({ _id: messageId });

// };

const pollingForMessages = (req, res) => {
  if (requestQue[req.user._id]) unSubscribe(req.user._id);
  subscribe(req.user._id, res);
  return;
};
const removePolling = (req, res) => {
  if (requestQue[req.user._id]) unSubscribe(req.user._id);
  return res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, message: "Request Deleted" });
  return;
};

module.exports = {
  getAllMessages,
  addMessage,
  pollingForMessages,
  removePolling,
};
