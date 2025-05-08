// src/components/chat/ChatMessages.tsx
import React from 'react';

const ChatMessages: React.FC = () => {
  return (
    <div className="custom-scrollbar max-h-full flex-1 space-y-6 overflow-auto p-5 xl:space-y-8 xl:p-6">
      {/* Received Message */}
      <div className="max-w-[350px]">
        <div className="flex items-start gap-4">
          <div className="h-10 w-full max-w-10 rounded-full">
            <img src="/images/user/user-17.jpg" alt="profile" className="h-full w-full overflow-hidden rounded-full object-cover object-center" />
          </div>

          <div>
            <div className="rounded-lg rounded-tl-sm bg-gray-100 px-3 py-2 dark:bg-white/5">
              <p className="text-sm text-gray-800 dark:text-white/90">
                I want to make an appointment tomorrow from 2:00 to 5:00pm?
              </p>
            </div>
            <p className="mt-2 text-theme-xs text-gray-500 dark:text-gray-400">
              Lindsey, 2 hours ago
            </p>
          </div>
        </div>
      </div>

      {/* Sent Message */}
      <div className="ml-auto max-w-[350px] text-right">
        <div className="ml-auto max-w-max rounded-lg rounded-tr-sm bg-brand-500 px-3 py-2 dark:bg-brand-500">
          <p className="text-sm text-white dark:text-white/90">
            If don't like something, I'll stay away from it.
          </p>
        </div>
        <p className="mt-2 text-theme-xs text-gray-500 dark:text-gray-400">
          2 hours ago
        </p>
      </div>

      {/* Add more messages as needed */}
    </div>
  );
};

export default ChatMessages;