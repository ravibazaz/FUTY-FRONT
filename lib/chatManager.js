// lib/chatManager.js
class ChatRoom extends EventTarget {
  send(eventName, data) {
    // eventName: "message" | "typing" | "presence" | "read"
    const payload = { event: eventName, data };
    this.dispatchEvent(new MessageEvent("event", { data: JSON.stringify(payload) }));
  }
}

class ChatManager {
  constructor() {
    this.rooms = new Map();
  }
  getRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new ChatRoom());
    }
    return this.rooms.get(roomId);
  }
  // optional: garbage collect empty rooms occasionally
}

export const chatManager = global.chatManager || (global.chatManager = new ChatManager());
