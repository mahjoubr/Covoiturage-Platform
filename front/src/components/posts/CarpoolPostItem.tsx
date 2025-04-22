import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, RotateCcw } from 'lucide-react';
import { CarpoolPost } from '../../types/posts.ts';
import { formatDate, formatTime } from '../../utils/dateTime';
import '../../styles/posts.css';

interface CarpoolPostItemProps {
  post: CarpoolPost;
  onClick: (post: CarpoolPost) => void;
}

const CarpoolPostItem: React.FC<CarpoolPostItemProps> = ({ post, onClick }) => {
  const [requestPending, setRequestPending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleJoinRide = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick event
    
    if (requestPending) {
      setRequestPending(false);
      setShowAlert(true);
      
      // Auto-hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setRequestPending(true);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-white/5 hover:shadow-lg dark:shadow-theme-xl transition-all duration-300 cursor-pointer relative flex flex-col h-full"
      onClick={() => onClick(post)}
    >
      <div className="flex flex-col space-y-3 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-brand-400">
            {post.departure} → {post.destination}
          </h3>
          <span className="bg-blue-100 dark:bg-brand-500/20 text-blue-800 dark:text-brand-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
            ${post.price}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>From: {post.departure}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>{formatDate(post.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>To: {post.destination}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>{formatTime(post.time)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-white/[0.03]">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-brand-500/15 rounded-full flex items-center justify-center text-blue-700 dark:text-brand-400 font-medium">
              {post.driverName.charAt(0)}
            </div>
            <span className="ml-2 text-sm font-medium dark:text-gray-300">{post.driverName}</span>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Users size={16} className="mr-1 text-gray-500 dark:text-gray-500" />
              <span>{post.seatCount} seats</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <RotateCcw size={16} className="mr-1 text-gray-500 dark:text-gray-500" />
              <span>{post.frequency}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Join Ride Button - Positioned at the bottom */}
      <div className="mt-4">
        <button
          onClick={handleJoinRide}
          className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
            requestPending
              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30'
              : 'bg-blue-100 dark:bg-brand-500/20 text-blue-700 dark:text-brand-400 border border-blue-200 dark:border-brand-500/20 hover:bg-blue-200 dark:hover:bg-brand-500/30'
          }`}
        >
          {requestPending ? 'Request Pending' : 'Join Ride'}
        </button>
      </div>
      
      {/* Semi-transparent Alert that overlays the card */}
      {showAlert && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/50 dark:bg-gray-900/60 text-white text-sm px-6 py-3 rounded-md shadow-lg">
            Request cancelled
          </div>
        </div>
      )}
    </div>
  );
};

export default CarpoolPostItem;
