import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../Hooks/UseAuthContext";
import io from "socket.io-client"


const address = process.env.REACT_APP_ADDRESS;
const port = process.env.REACT_APP_PORT;
const socket = io("http://localhost:5001");

// const mockMessages = [
//   { id: 1, sender: "Hedwig", text: "Welcome to the Owlery chat! 🦉" },
//   { id: 2, sender: "You", text: "Hi Hedwig! Who's delivering the mail today?" },
//   { id: 3, sender: "Hedwig", text: "All the owls are busy with Hogwarts letters!" },
// ];

const Chat = () => {
  const { user } = useAuthContext();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
 

  // Fetch friends on mount
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user?.userId) return;
       const res = await axios.post(`http://${address}:${port}/api/users`,{
        command: "getUserFriends",
        data: { userId: user.userId }
      });
      setFriends(res.data.friends);

    };
    fetchFriends();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(messages)
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "" || !selectedFriend) return;
    // setMessages((prev) => [
    //   ...prev,
    //   { id: prev.length + 1, sender: "You", text: input },
    // ]);
    console.log("sent message: ",{ userid: user.id, friendid: selectedFriend._id, content: input })
    socket.emit('chat message', { userid: user.userId, friendid: selectedFriend._id, content: input });
    setInput("");
  };

  const changeSelectedFriend = (friend) =>{
    setSelectedFriend(friend)
      console.log("Sending to server: ", {userid: user.userId,
      friendid: friend._id})
    axios.get('http://localhost:5000/api/messages',{
      params:{userid: user.userId,
      friendid: friend._id}
    })
      .then(res => setMessages(res.data))
      .catch(console.error);
        socket.on('chat message', msg => {
            setMessages(prev => [...prev, msg]);
        });
    return () => socket.off('chat message');
    console.log(friend)
  }

  return (
    <div className="flex flex-col md:flex-row h-[80vh] max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
      {/* Friends List */}
      <div className="w-full md:w-1/3 border-r bg-gray-50 rounded-l-xl p-4 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 text-purple-900">Your Friends</h3>
        {friends.length === 0 && <div className="text-gray-400">No friends found.</div>}
        <ul>
          {friends.map((friend) => (
            <li
              key={friend._id}
              className={`cursor-pointer px-3 py-2 rounded-lg mb-2 hover:bg-purple-100 transition ${
                selectedFriend && selectedFriend._id === friend._id ? "bg-purple-200 font-semibold" : ""
              }`}
              onClick={() => changeSelectedFriend(friend)}
            >
              🧙 {friend.name}
            </li>
          ))}
        </ul>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-purple-700 to-indigo-700 rounded-t-xl">
          <h2 className="text-xl font-bold text-gold">
            {selectedFriend ? `Chat with ${selectedFriend.name}` : "Owlery Chat"}
          </h2>
          <span className="text-2xl">🦉</span>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50">
          {selectedFriend ? (
            messages.map((msg,i) => (
              <div
                key={msg.id || i}
                className={`flex ${msg.userid === user.userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl shadow text-base max-w-xs ${
                    msg.userid === user.userId
                      ? "bg-gradient-to-r from-purple-200 to-indigo-100 text-gray-900"
                      : "bg-gold/80 text-gray-900"
                  }`}
                >
                  <span className="font-semibold">{ msg.userid === user.userId ? user.name : selectedFriend.name}: </span>
                  {msg.content}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center mt-10">Select a friend to start chatting.</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 px-6 py-4 border-t bg-white rounded-b-xl"
        >
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder={selectedFriend ? "Type your message..." : "Select a friend to chat"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={300}
            disabled={!selectedFriend}
          />
          <button
            type="submit"
            disabled={!selectedFriend}
            className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold px-6 py-2 rounded-full shadow hover:scale-105 transition-all duration-200 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;