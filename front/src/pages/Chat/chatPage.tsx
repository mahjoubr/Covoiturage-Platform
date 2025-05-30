// src/pages/Chat.tsx
import React, { useState } from 'react';
import ChatSidebar from '../../components/chat/chatSidebar';
import ChatBox from '../../components/chat/chatBox';
import { Chat} from '../../types/chat.ts';


const ChatPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    setIsMobile(false); 
  };
  
  return (
<div className="mx-auto max-w-full pt-1 p-4 md:pt-4 md:p-6">


      {/* Chat Container */}
      <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
        <div className="flex h-full flex-col gap-6 xl:flex-row xl:gap-5">
          {/* Chat Sidebar */}
          <ChatSidebar 
            isMobile={isMobile} 
            setIsMobile={setIsMobile} 
            onChatClick={handleChatClick} 
          />    
          {selectedChat ? (
            <ChatBox chatId={selectedChat.id} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Select a chat to start messaging
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default ChatPage;