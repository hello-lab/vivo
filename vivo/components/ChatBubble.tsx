// ChatBubble.tsx
import React from 'react';

const ChatBubble = ({ message, sender }) => {
  return (
    <div className={`chat-bubble ${sender}`}>
      <p>{message}</p>
    </div>
  );
};

export default ChatBubble;
