const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/MessageController");
const { upload } = require("../config/cloudinary");

const MessageRouter = (socketHandler) => {
  const messageController = new MessageController(socketHandler);
  router.post("/react", messageController.reactToMessage);
  router.post("/text", messageController.sendTextMessage);
  router.post("/reply", messageController.sendReplyMessage);
  router.post("/location", messageController.sendLocationMessage);
  router.get("/:conversationId", messageController.getMessagesByConversation);
  router.get("/channel/:channelId", messageController.getMessagesByChannelId);
  router.delete(
    "/:id/conversation/:conversationId",
    messageController.recallMessage
  );
  router.post(
    "/images",
    upload.array("image"),
    messageController.sendImageMessage
  );
  router.post(
    "/video",
    upload.single("video"),
    messageController.sendVideoMessage
  );
  router.post(
    "/file",
    upload.single("file"),
    messageController.sendFileMessage
  );
  router.delete("/:id/only", messageController.deleteMessageForMe);
  router.post("/tts", messageController.convertTextToSpeech);

  return router;
};

module.exports = MessageRouter;
