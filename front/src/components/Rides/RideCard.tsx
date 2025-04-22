/*import React from 'react';
import { RidePost } from '../../types';

interface RideCardProps {
  ride: RidePost;
  onView: (post: RidePost) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onView }) => {
  const { date, from, to, riders, driver, isYourRide, isRideYouTook } = ride;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-2px] hover:shadow-lg relative">

      {isYourRide && (
        <div className="absolute top-2 right-2 bg-blue-500 dark:bg-blue-700 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
          my Ride
        </div>
      )}
      {isRideYouTook && (
        <div className="absolute top-2 right-2 bg-green-500 dark:bg-green-700 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
          Ride I Took
        </div>
      )}

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            {date}
          </h3>
          <div className="flex items-center mb-1">
            <span className="text-gray-600 dark:text-white/70 font-medium w-16">From:</span>
            <span className="text-gray-800 dark:text-white/90">{from}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-white/70 font-medium w-16">To:</span>
            <span className="text-gray-800 dark:text-white/90">{to}</span>
          </div>
        </div>

        {isYourRide && riders && riders.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-1">Riders:</h4>
            <div className="text-sm text-gray-800 dark:text-white/90">
              {riders.join(', ')}
            </div>
          </div>
        )}

        {isRideYouTook && driver && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-1">Driver:</h4>
            <div className="text-sm text-gray-800 dark:text-white/90">
              {driver}
            </div>
          </div>
        )}

        <button
          onClick={() => onView(ride)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors dark:bg-brand-500/[0.12] dark:text-white/90 dark:hover:bg-white/5 mt-2"
        >
          View Post
        </button>
      </div>
    </div>
  );
};

export default RideCard;*/
import React from 'react';
import { RidePost } from '../../types';

interface RideCardProps {
  ride: RidePost;
  onView: (postId: string) => void; // pass only postId here
}


const RideCard: React.FC<RideCardProps> = ({ ride, onView }) => {
  const { date, from, to, riders, driver, isYourRide, isRideYouTook } = ride;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-2px] hover:shadow-lg relative">

      {isYourRide && (
        <div className="absolute top-2 right-2 bg-blue-500 dark:bg-blue-700 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
          my Ride
        </div>
      )}
      {isRideYouTook && (
        <div className="absolute top-2 right-2 bg-green-500 dark:bg-green-700 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
          Ride I Took
        </div>
      )}

      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            {date}
          </h3>
          <div className="flex items-center mb-1">
            <span className="text-gray-600 dark:text-white/70 font-medium w-16">From:</span>
            <span className="text-gray-800 dark:text-white/90">{from}</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-white/70 font-medium w-16">To:</span>
            <span className="text-gray-800 dark:text-white/90">{to}</span>
          </div>
        </div>

        {isYourRide && riders && riders.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-1">Riders:</h4>
            <div className="text-sm text-gray-800 dark:text-white/90">
              {riders.join(', ')}
            </div>
          </div>
        )}

        {isRideYouTook && driver && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-1">Driver:</h4>
            <div className="text-sm text-gray-800 dark:text-white/90">
              {driver}
            </div>
          </div>
        )}

        <button
          onClick={() => onView(ride.postId)}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors dark:bg-brand-500/[0.12] dark:text-white/90 dark:hover:bg-white/5 mt-2"
        >
          View Post
        </button>

      </div>
    </div>
  );
};

export default RideCard;