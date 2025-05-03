// src/components/chat/ChatMessages.tsx
import React from "react";

type Message = {
  id: number;
  text: string;
  from: "user"; // only allow 'user' now
  timestamp: string;
  name?: string;
  avatar?: string;
};


type ChatMessagesProps = {
  messages: Message[];
};

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="custom-scrollbar max-h-full flex-1 space-y-6 overflow-auto p-5 xl:space-y-8 xl:p-6">
      {messages.map((msg) => (
        <div key={msg.id} className="ml-auto max-w-[350px] text-right">
          <div className="ml-auto max-w-max rounded-lg rounded-tr-sm bg-brand-500 px-3 py-2 dark:bg-brand-500">
            <p className="text-sm text-white dark:text-white/90">{msg.text}</p>
          </div>
          <p className="mt-2 text-theme-xs text-gray-500 dark:text-gray-400">
            {msg.timestamp}
          </p>
        </div>
      ))}
    </div>
  );
};


export default ChatMessages;
