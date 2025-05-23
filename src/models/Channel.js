const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const NotFoundError = require("../exceptions/NotFoundError");
const CustomError = require("../exceptions/CustomError");

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    conversationId: {
      type: ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

channelSchema.index({ conversationId: 1, createdAt: 1 });

channelSchema.statics.checkExistence = async (query, message) => {
  const channel = await Channel.findOne(query).lean();
  if (!channel) throw new NotFoundError(message);
  return channel;
};

channelSchema.statics.getById = async (_id, message = "Channel") => {
  if (!ObjectId.isValid(_id)) throw new NotFoundError(`${message}`);
  return await Channel.checkExistence({ _id }, message);
};

channelSchema.statics.getAllChannelByConversationId = async (
  conversationId
) => {
  // sort by createdAt desc
  const channels = await Channel.find({ conversationId })
    .sort({ createdAt: 1 })
    .lean();
  if (!channels) throw new NotFoundError("Channel");
  return channels;
};

channelSchema.statics.addChannel = async (channel) => {
  const existingChannel = await Channel.findOne({
    name: channel.name.trim(),
  });
  if (existingChannel) {
    throw new CustomError("Channel name already exists", 400);
  }

  return await Channel.create(channel);
};

channelSchema.statics.updateChannel = async (channelId, channel) => {
  const existingChannel = await Channel.findOne({
    name: channel.name.trim(),
  });
  if (existingChannel) {
    throw new CustomError("Channel name already exists", 400);
  }

  const channelUpdated = await Channel.findOneAndUpdate(
    { _id: channelId },
    { $set: channel },
    { new: true }
  );
  if (!channelUpdated) throw new NotFoundError("Channel");
  return channelUpdated;
};

channelSchema.statics.deleteChannel = async (channelId) => {
  const channelDelete = await Channel.findOneAndDelete({ _id: channelId });
  if (!channelDelete) throw new NotFoundError("Channel");
  return channelDelete;
};

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
