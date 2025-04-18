const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Member = require("./Member");
const ObjectId = mongoose.Types.ObjectId;
const NotFoundError = require("../exceptions/NotFoundError");

const conversationSchema = new Schema(
  {
    name: String,
    avatar: String,
    leaderId: ObjectId,
    managerIds: {
      type: [ObjectId],
      default: [],
    },
    lastMessageId: {
      type: ObjectId,
      ref: "message",
    },
    pinMessageIds: {
      type: [ObjectId],
      default: [],
    },
    members: { type: [ObjectId], ref: "Member" },
    joinRequests: {
      type: [ObjectId],
      default: [],
    },
    isJoinFromLink: {
      type: Boolean,
      default: true,
    },
    type: Boolean,
  },
  { timestamps: true }
);

conversationSchema.index({ name: "text" });

conversationSchema.statics.getListByUserId = async (userId) => {
  // Tìm tất cả Member của userId
  const members = await Member.find({ userId }).lean();
  const memberIds = members.map((m) => m._id);
  const memberIdMap = {};
  members.forEach((m) => {
    memberIdMap[m.conversationId.toString()] = m._id;
  });

  // Lấy tất cả conversation liên quan đến user, không lọc type
  const conversations = await Conversation.find({
    members: { $in: memberIds },
  })
    .sort({ updatedAt: -1 })
    .populate({
      path: "lastMessageId",
      match: (conversation) => ({
        deletedMemberIds: { $nin: [memberIdMap[conversation._id.toString()]] },
        isDeleted: { $ne: true },
      }),
      select: "content createdAt",
    })
    .lean();

  // Nếu không có conversation thì trả luôn
  if (!conversations.length) return [];

  // Lấy toàn bộ memberIds xuất hiện trong các conversation
  const allMemberIds = [
    ...new Set(
      conversations.flatMap((c) => c.members.map((id) => id.toString()))
    ),
  ];

  // Truy vấn Member + User 1 lần, giảm số query
  const membersData = await Member.find({ _id: { $in: allMemberIds } })
    .select("name userId")
    .populate({ path: "userId", select: "avatar" })
    .lean();

  // Map về dạng object để dễ lookup
  const memberMap = {};
  membersData.forEach((m) => {
    memberMap[m._id.toString()] = {
      name: m.name,
      userId: m.userId,
      avatar: m.userId?.avatar || null,
    };
  });

  // Map lại conversation: nếu type === false thì bổ sung name + avatar cho members
  const result = conversations.map((conversation) => {
    if (conversation.type === false) {
      conversation.members = conversation.members.map((memberId) => {
        const info = memberMap[memberId.toString()] || {};
        return {
          _id: memberId,
          userId: info.userId._id,
          name: info.name || null,
          avatar: info.avatar || null,
        };
      });
    }
    return conversation;
  });

  return result;
};

conversationSchema.statics.getListGroupByNameContainAndUserId = async (
  name,
  userId
) => {
  return Conversation.find({
    name: {
      $regex: name,
      $options: "i",
    },
    members: {
      $in: [userId],
    },
    type: true,
  })
    .sort({ updatedAt: -1 })
    .lean();
};

conversationSchema.statics.getListIndividualByNameContainAndUserId = async (
  name,
  userId
) => {
  return Conversation.aggregate([
    {
      $match: {
        members: {
          $in: [ObjectId(userId)],
        },
        type: false,
      },
    },
    {
      $lookup: {
        from: "members",
        localField: "_id",
        foreignField: "conversationId",
        as: "users",
      },
    },
    {
      $unwind: "$users",
    },
    {
      $match: {
        "users.userId": { $ne: ObjectId(userId) },
        "users.name": { $regex: name, $options: "i" },
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
    {
      $project: { _id: 1 },
    },
  ]).exec();
};

conversationSchema.statics.getListNameAndAvatarOfMembersById = async (_id) => {
  return Conversation.aggregate([
    {
      $match: {
        _id: ObjectId(_id),
      },
    },
    {
      $project: {
        _id: 0,
        members: 1,
      },
    },
    {
      $unwind: "$members",
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        name: "$user.name",
        avatar: "$user.avatar",
        avatarColor: "$user.avatarColor",
      },
    },
  ]).exec();
};

conversationSchema.statics.existsIndividualConversation = async (
  userId1,
  userId2
) => {
  // Lấy danh sách các conversation cá nhân có chứa cả 2 user dưới dạng Member
  const user1MemberIds = await Member.find({ userId: userId1 })
    .select("conversationId")
    .lean();
  const user2MemberIds = await Member.find({ userId: userId2 })
    .select("conversationId")
    .lean();

  const convIds1 = user1MemberIds.map((m) => m.conversationId.toString());
  const convIds2 = user2MemberIds.map((m) => m.conversationId.toString());

  // Tìm những conversationId mà cả hai user đều có mặt
  const commonConversationIds = convIds1.filter((id) => convIds2.includes(id));

  if (commonConversationIds.length === 0) return null;

  // Kiểm tra xem conversation đó có phải là chat cá nhân không
  const existingConversation = await Conversation.findOne({
    _id: { $in: commonConversationIds },
    type: false,
  }).lean();

  return existingConversation ? existingConversation._id : null;
};

conversationSchema.statics.getByIdAndUserId = async (
  _id,
  userId,
  message = "Conversation"
) => {
  // Tìm memberId từ userId
  const member = await Member.findOne({ conversationId: _id, userId }).lean();
  if (!member) throw new NotFoundError(message);

  const conversation = await Conversation.findOne({
    _id,
    members: { $in: [member._id] }, // Kiểm tra memberId
  }).lean();
  if (!conversation) throw new NotFoundError(message);
  return conversation;
};

conversationSchema.statics.getById = async (_id, message = "Conversation") => {
  // Tìm conversation theo id
  const conversation = await Conversation.findById(_id)
    .populate({
      path: "lastMessageId",
      select: "content createdAt",
    })
    .lean();

  if (!conversation) throw new NotFoundError(message);

  // Chỉ format lại members nếu có members và type === false
  if (conversation.members?.length && conversation.type === false) {
    // Lấy tất cả member IDs trong conversation
    const memberIds = conversation.members;

    // Truy vấn Member và populate User để lấy thông tin chi tiết
    const membersData = await Member.find({ _id: { $in: memberIds } })
      .select("name userId")
      .populate({ path: "userId", select: "avatar" })
      .lean();

    // Map lại thành viên với thông tin chi tiết
    conversation.members = membersData.map((member) => ({
      _id: member._id,
      userId: member.userId?._id,
      name: member.name || null,
      avatar: member.userId?.avatar || null,
    }));
  }

  return conversation;
};

conversationSchema.statics.existsByUserIds = async (
  _id,
  userIds,
  message = "Conversation"
) => {
  const conversation = await Conversation.findOne({
    _id,
    members: {
      $all: userIds,
    },
  }).lean();
  if (!conversation) throw new NotFoundError(message);
  return conversation;
};

conversationSchema.statics.acceptJoinRequest = async (
  conversationId,
  userId
) => {
  const conversation = await Conversation.findById(conversationId).lean();
  if (!conversation) throw new NotFoundError("Conversation");
  if (!conversation.joinRequests.includes(userId))
    throw new Error("User has not requested to join this group");
  conversation.members.push(userId);
  conversation.joinRequests = conversation.joinRequests.filter(
    (id) => id.toString() !== userId.toString()
  );
  await Conversation.findByIdAndUpdate(conversationId, conversation);
  return conversation;
};

conversationSchema.statics.rejectJoinRequest = async (
  conversationId,
  userId
) => {
  const conversation = await Conversation.findById(conversationId).lean();
  if (!conversation) throw new NotFoundError("Conversation");
  if (!conversation.joinRequests.includes(userId))
    throw new Error("User has not requested to join this group");
  conversation.joinRequests = conversation.joinRequests.filter(
    (id) => id.toString() !== userId.toString()
  );
  await Conversation.findByIdAndUpdate(conversationId, conversation);
  return conversation;
};

const Conversation = mongoose.model("conversation", conversationSchema);
module.exports = Conversation;
