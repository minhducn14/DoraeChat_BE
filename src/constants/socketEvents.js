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
  DISBANDED_CONVERSATION: "disbanded-conversation",
  NEW_GROUP_CONVERSATION: "new-group-conversation",
  CONVERSATION_DISBANDED: "conversation-disbanded",
  HIDE_CONVERSATION: "hide-conversation",
  DELETE_CONVERSATION: "delete-conversation",
  TRANSFER_ADMIN: "transfer-admin",
  UPDATE_MANAGERS: "update-managers",
  DEMOTE_MANAGER: "demote-manager",
  UPDATE_NAME_CONVERSATION: "update-name-conversation",
  UPDATE_AVATAR_GROUP_CONVERSATION: "update-avatar-group-conversation",
  TOGGLE_JOIN_APPROVAL: "toggle-join-approval",
  ACCEPT_JOIN_REQUEST: "accept-join-request",
  REJECT_JOIN_REQUEST: "reject-join-request",
  MEMBER_REMOVED: "member-removed",
  MEMBER_ADDED: "member-added",
  JOIN_REQUEST_APPROVED: "join-request-approved",
  //Messages
  RECEIVE_MESSAGE: "receive-message",
  MESSAGE_RECALLED: "message-recalled",
  MESSAGE_DELETED_FOR_ME: "message_deleted_for_me",
  REACT_TO_MESSAGE: "react-to-message",
  TAGGED: "tagged",

  // Vote
  CREATE_VOTE: "create-vote",
  VOTE_OPTION_SELECTED: "vote-option-selected",
  VOTE_OPTION_DESELECTED: "vote-option-deselected",
  ADD_VOTE_OPTION: "add-vote-option",
  DELETE_VOTE_OPTION: "delete-vote-option",
  VOTE_LOCKED: "vote-locked",

  // Pin message
  PIN_MESSAGE: "pin-message",
  UNPIN_MESSAGE: "unpin-message",

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
  LEAVE_CALL: "leave-call",
  GET_CURRENT_CALL: "get-current-call",

  // Call - for group call (Metered)
  GROUP_CALL_USER: "group-call-user",
  GROUP_CALL_ENDED: "group-call-ended",

  // Last view tracking
  CONVERSATION_LAST_VIEW: "conversation-last-view",
  USER_LAST_VIEW: "user-last-view",

  // Member
  UPDATE_MEMBER_NAME: "update-member-name",

  // Channel
  NEW_CHANNEL: "new-channel",
  DELETE_CHANNEL: "delete-channel",
  UPDATE_CHANNEL: "update-channel",
};

module.exports = SOCKET_EVENTS;
