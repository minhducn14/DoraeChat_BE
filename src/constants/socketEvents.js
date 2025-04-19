const SOCKET_EVENTS = {
  // Friend system
  ACCEPT_FRIEND: "accept-friend",
  SEND_FRIEND_INVITE: "send-friend-invite",
  DELETED_FRIEND_INVITE: "deleted-friend-invite",
  DELETED_INVITE_WAS_SEND: "deleted-invite-was-send",
  DELETED_FRIEND: "deleted-friend",
  REVOKE_TOKEN: "revoke-token",

  // User presences
  JOIN: "join",
  DISCONNECT: "disconnect",

  // Conversations
  JOIN_CONVERSATIONS: "join-conversations",
  JOIN_CONVERSATION: "join-conversation",
  LEAVE_CONVERSATION: "leave-conversation",
  //Messages
  RECEIVE_MESSAGE: "receive-message",
  MESSAGE_RECALLED: "message-recalled",
  MESSAGE_DELETED_FOR_ME: "message_deleted_for_me",

  // Typing indicators
  TYPING: "typing",
  NOT_TYPING: "not-typing",

  // Online status
  GET_USER_ONLINE: "get-user-online",

  // Call - for simple-peer
  SUBSCRIBE_CALL_VIDEO: "subscribe-call-video",
  SUBSCRIBE_CALL_AUDIO: "subscribe-call-audio",
  NEW_USER_CALL: "new-user-call",
  REJECT_CALL: "reject-call",
  CALL_REJECTED: "call-rejected",
  END_CALL: "end-call",
  CALL_ENDED: "call-ended",
  CALL_USER: "call-user",
  ANSWER_CALL: "answer-call",
  RECEIVE_SIGNAL: "receive-signal",


  // Last view tracking
  CONVERSATION_LAST_VIEW: "conversation-last-view",
  USER_LAST_VIEW: "user-last-view",
};

module.exports = SOCKET_EVENTS;
