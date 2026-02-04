// lib/chatHelpers.js
export function getChatRoom(userA, userB) {
  // Accept ids (strings). Sort them so room is same both ways.
  return [String(userA), String(userB)].join("_");
}
