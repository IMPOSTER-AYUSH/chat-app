import React, { useContext, useEffect, useRef, useState } from 'react';
import assets, { messagesDummyData } from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages} = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)


  const scrollEnd = useRef();

const [input, setInput] = useState('');

// Handle sending a message
const handleSendMessage = async (e)=>{
e.preventDefault();
if(input.trim() === "") return null;
await sendMessage({text: input.trim()});
setInput("")
}

// Handle sending an image
const handleSendImage = async (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) {
    toast.error("Select an image file");
    e.target.value = ""; // Clear file input even if wrong
    return;
  }
  const reader = new FileReader();

  reader.onloadend = async () => {
    await sendMessage({ image: reader.result });
    e.target.value = ""; // Clear after send to allow re-selecting same file
  };

  reader.readAsDataURL(file);
};

return selectedUser ? (
  <div className="h-full overflow-scroll relative backdrop-blur-lg">
    
      {/* ----HEADER---- */}
<div className="flex items-center gap-4 py-3 px-4 border-b border-stone-500 bg-black/20">
  {/* Profile picture */}
  <img
    src={selectedUser?.profilePic || assets.avatar_icon}
    alt="User Avatar"
    className="w-10 h-10 rounded-full object-cover border border-gray-600 aspect-square"
    onError={(e) => (e.target.src = assets.avatar_icon)} // fallback if image breaks
  />

  {/* Name and status */}
  <div className="flex-1">
    <p className="text-lg text-white font-medium flex items-center gap-2">
      {selectedUser?.fullName}
      {onlineUsers.includes(selectedUser._id) && (
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
      )}
    </p>
  </div>

  {/* Back button (for mobile) */}
  <img
    onClick={() => setSelectedUser(null)}
    src={assets.back_icon || assets.arrow_left_icon} // make sure this is a real back icon
    alt="Back"
    className="md:hidden w-6 h-6 cursor-pointer"
  />

  {/* Help icon (desktop only) */}
  <img
    src={assets.help_icon}
    alt="Help"
    className="hidden md:block w-6 h-6"
  />
</div>


     {/* ----CHAT AREA---- */}
<div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
  {messages.map((msg, index) => {
    const isSentByCurrentUser = msg.senderId === authUser._id;

    return (
      <div
        key={index}
        className={`flex items-end mb-6 ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isSentByCurrentUser && (
          <div className="flex flex-col items-center mr-2">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt="Sender Avatar"
              className="w-7 h-7 rounded-full"
            />
            <p className="text-xs text-gray-500">
              {formatMessageTime(msg.createdAt)}
            </p>
          </div>
        )}

        {msg.image ? (
          <img
            src={msg.image}
            alt=""
            className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
          />
        ) : (
          <p
            className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white ${
              isSentByCurrentUser
                ? 'bg-violet-500/30 rounded-br-none'
                : 'bg-violet-600/30 rounded-bl-none'
            }`}
          >
            {msg.text}
          </p>
        )}

        {isSentByCurrentUser && (
          <div className="flex flex-col items-center ml-2">
            <img
              src={authUser?.profilePic || assets.avatar_icon}
              alt="User Avatar"
              className="w-7 h-7 rounded-full"
            />
            <p className="text-xs text-gray-500">
              {formatMessageTime(msg.createdAt)}
            </p>
          </div>
        )}
      </div>
    );
  })}

  <div ref={scrollEnd}></div>
</div>




      {/* ----bottom area---- */}
    <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
      <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full ">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
          type="text"
          placeholder="Send a message .. "
          className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
        />

        <input
          onChange={handleSendImage}
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
        />
        <label htmlFor="image">
          <img
            src={assets.gallery_icon}
            alt="upload"
            className="w-5 mr-2 cursor-pointer"
          />
        </label>
      </div>
      <img
        onClick={handleSendMessage}
        src={assets.send_button}
        alt="send"
        className="w-7 cursor-pointer"
      />
    </div>
  </div>
) : (
  <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
    <img src={assets.logo_icon} className="max-w-16" alt="logo" />
    <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
  </div>
);
};

export default ChatContainer;