const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const NotFoundError = require('../exception/NotFoundError');

const friendSchema = new Schema({
    userIds: [ObjectId],
}, { timestamps: true });

friendSchema.index({ userIds: 1 });

friendSchema.statics.findFriendByUserIds = async (userId1, userId2) => {
    return this.findOne({
        userIds: { $all: [userId1, userId2] },
    }).lean();
};

friendSchema.statics.existsByIds = async (userId1, userId2) => {
    if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) throw new NotFoundError('Invalid User ID');
    const isExists = await this.findFriendByUserIds(userId1, userId2);
    return !!isExists;
};

friendSchema.statics.checkByIds = async (userId1, userId2, message = 'Friend') => {
    if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) throw new NotFoundError('Invalid User ID');
    const isExists = await this.findFriendByUserIds(userId1, userId2);
    if (!isExists) throw new NotFoundError(message);
};

friendSchema.statics.deleteByIds = async (userId1, userId2, message = 'Friend') => {
    if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) throw new NotFoundError('Invalid User ID');
    const queryResult = await this.deleteOne({
        userIds: { $all: [userId1, userId2] },
    });
    if (queryResult.deletedCount === 0) throw new NotFoundError(message);
};

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;