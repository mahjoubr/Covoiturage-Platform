// src/pages/Chat.tsx
import React, { useState } from 'react';
import ChatSidebar from '../../components/chat/chatSidebar';
import ChatBox from '../../components/chat/chatBox';

const ChatPage: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  

  
  return (
<div className="mx-auto max-w-full pt-1 p-4 md:pt-4 md:p-6">
{/* Breadcrumb */}
<div className="flex flex-wrap items-center justify-between gap-3 mb-6 mt-0 pt-0">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Chat</h2>
        <nav>
          <ol className="flex items-center gap-1.5">
            <li>
              <a className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400" href="/">
                Home
                <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke="" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </a>
            </li>
            <li className="text-sm text-gray-800 dark:text-white/90">Chat</li>
          </ol>
        </nav>
      </div>

      {/* Chat Container */}
      <div className="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
        <div className="flex h-full flex-col gap-6 xl:flex-row xl:gap-5">
          {/* Chat Sidebar */}
          <ChatSidebar isMobile={isMobile} setIsMobile={setIsMobile} />
          
          {/* Chat Box */}
          <ChatBox />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;