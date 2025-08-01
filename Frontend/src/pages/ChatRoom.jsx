import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import instance from "../axiosConfig";
import EmojiPicker from "emoji-picker-react";

const socket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });

function ChatRoom() {
  const { roomId: roomIdFromParams } = useParams();
  const location = useLocation();
  const roomId = location.state?.roomId || roomIdFromParams;

  const [mongoUserId, setMongoUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverProfile, setReceiverProfile] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState({});
  const bottomRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiRef = useRef(null); // 👈 Ref for emoji picker

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    async function setupChat() {
      try {
        const meRes = await instance.get("/api/users/me");
        const currentUser = meRes.data;
        setMongoUserId(currentUser.uniqueId);
        setCurrentUserProfile(currentUser);

        if (!socket.connected) socket.connect();
        socket.emit("join_room", roomId);

        const roomRes = await instance.get(`/messages/${roomId}`);
        const roomData = roomRes.data;
        setMessages(roomData.messages);

        const [user1, user2] = roomData.participants;
        const receiver = user1 === currentUser.uniqueId ? user2 : user1;

        const receiverReq = await instance.get(`/api/users/${receiver}`);
        setReceiverProfile(receiverReq.data);
      } catch (err) {
        console.error("Error during chat setup:", err);
      }
    }

    setupChat();

    const receiveHandler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", receiveHandler);
    return () => {
      socket.off("receive_message", receiveHandler);
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        room: roomId,
        sender: mongoUserId,
        text: message,
        time: new Date(),
      };
      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  return (
    <div className="px-6 pt-20 text-white bg-gradient-to-br from-blue-900 via-blue-900 to-indigo-900 min-h-screen">
      <div className="text-2xl font-bold mb-4 pl-2 mr-20">
        Chat with
        <img
          src={receiverProfile.profilePic}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2 mx-4 inline-block"
        />
        <span>{receiverProfile.userName}</span>
      </div>

      <div className="bg-blue-950 p-4 rounded-md h-[400px] overflow-y-scroll mb-4">
        {messages.map((msg, idx) => {
          const isMe = msg.sender === mongoUserId;
          const user = isMe ? currentUserProfile : receiverProfile;

          return (
            <div
              key={idx}
              className={`flex mb-4 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div className="max-w-xs">
                <p className="text-xs text-gray-300 mb-1">{user.userName}</p>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isMe ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {isMe && (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="relative">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xl"
            title="Emoji"
          >
            😊
          </button>

          <input
            className="flex-1 p-2 rounded-md text-white bg-gray-800"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />

          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-600 rounded-md"
          >
            Send
          </button>
        </div>

        {showEmojiPicker && (
          <div ref={emojiRef} className="absolute bottom-12 left-0 z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="dark"
              autoFocusSearch={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
