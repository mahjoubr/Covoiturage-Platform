/*import React from 'react';
import { Ride } from '../../types/posts';
import { useQuery } from '@apollo/client';
import { GET_POST_BY_ID } from '../../graphQl/queries/posts';

interface RideCardProps {
  ride: Ride;
  onView: (postId: string) => void; // pass only postId here
}


const RideCard: React.FC<RideCardProps> = ({ ride, onView }) => {

  const { date, arrival,departure, isYourRide, isRideYouTook, driver,appUserRides} = ride;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-2px] hover:shadow-lg relative">
    <div className="absolute top-3 right-3 z-10">
      {isYourRide && (
        <div className="bg-blue-500 dark:bg-blue-700 text-white text-xs px-3 py-1 rounded-full flex items-center font-medium">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          My Ride
        </div>
      )}
      {isRideYouTook && (
        <div className="bg-green-500 dark:bg-green-700 text-white text-xs px-3 py-1 rounded-full flex items-center font-medium">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          Ride I Took
        </div>
      )}
    </div>

    <div className="p-5">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <span>{departure}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          <span>{arrival}</span>
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {date}
        </p>
      </div>

      <div className="mb-4 relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
        
        <div className="flex items-start mb-4 relative">
          <div className="absolute left-[-24px] w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded-full border-2 border-white dark:border-gray-800"></div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Pick-up Location</span>
            <span className="text-gray-800 dark:text-white font-medium">{departure}</span>
          </div>
        </div>
        
        <div className="flex items-start relative">
          <div className="absolute left-[-24px] w-4 h-4 bg-green-500 dark:bg-green-600 rounded-full border-2 border-white dark:border-gray-800"></div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Drop-off Location</span>
            <span className="text-gray-800 dark:text-white font-medium">{arrival}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        {isYourRide && appUserRides && appUserRides.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Riders:</h4>
            <div className="flex flex-wrap gap-2">
              {appUserRides.map((rider, index) => (
                <span key={index} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white/90 text-xs px-2 py-1 rounded-full">
                  {rider.appUser.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {isRideYouTook && driver && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Driver:</h4>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-800 dark:text-white/90">
                {driver}
              </span>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => onView(ride.post.id)}
        className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500/20 dark:text-white/90 dark:hover:bg-blue-500/30 font-medium flex items-center justify-center"
      >
        <span>View Post</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
  );
};

export default RideCard;*/
import React from 'react';
import { CarpoolPost, Ride } from '../../types/posts';
import { useQuery } from '@apollo/client';
import { GET_POST_BY_ID } from '../../graphQl/queries/posts';

interface RideCardProps {
  ride: Ride;
  onView: (postId: string) => void; // Function expects postId as string
}

const RideCard: React.FC<RideCardProps> = ({ ride, onView }) => {
    const { loading, error, data } = useQuery(GET_POST_BY_ID, {
      variables: { id: ride.post }
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const post = data.getPostById;
  const { date, arrival, departure, isYourRide, isRideYouTook, driver, appUserRides } = ride;

  // Handle loading and error states
  if (loading) return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    </div>
  );

  if (error) return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
      <p className="text-red-500">Error loading ride details</p>
    </div>
  );


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-2px] hover:shadow-lg relative">
      {/* Badge positioning */}
      <div className="absolute top-3 right-3 z-10">
        {isYourRide && (
          <div className="bg-blue-500 dark:bg-blue-700 text-white text-xs px-3 py-1 rounded-full flex items-center font-medium">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            My Ride
          </div>
        )}
        {isRideYouTook && (
          <div className="bg-green-500 dark:bg-green-700 text-white text-xs px-3 py-1 rounded-full flex items-center font-medium">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Ride I Took
          </div>
        )}
      </div>

      {/* Card content with better spacing and organization */}
      <div className="p-5">
        {/* Header with route as title */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <span>{departure}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>{arrival}</span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {date}
          </p>
        </div>

        {/* Route information with icons */}
        <div className="mb-4 relative pl-6">
          {/* Vertical line connecting points */}
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
          
          {/* Departure */}
          <div className="flex items-start mb-4 relative">
            <div className="absolute left-[-24px] w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded-full border-2 border-white dark:border-gray-800"></div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Pick-up Location</span>
              <span className="text-gray-800 dark:text-white font-medium">{departure}</span>
            </div>
          </div>
          
          {/* Arrival */}
          <div className="flex items-start relative">
            <div className="absolute left-[-24px] w-4 h-4 bg-green-500 dark:bg-green-600 rounded-full border-2 border-white dark:border-gray-800"></div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Drop-off Location</span>
              <span className="text-gray-800 dark:text-white font-medium">{arrival}</span>
            </div>
          </div>
        </div>

        {/* People information */}
        <div className="mb-4">
          {isYourRide && appUserRides && appUserRides.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Riders:</h4>
              <div className="flex flex-wrap gap-2">
                {appUserRides.map((rider, index) => (
                  <span key={index} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white/90 text-xs px-2 py-1 rounded-full">
                    {rider?.appUser?.name || 'Unknown User'}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isRideYouTook && driver && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-white/80 mb-2">Driver:</h4>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {driver}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={() => onView(""+post.id)}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500/20 dark:text-white/90 dark:hover:bg-blue-500/30 font-medium flex items-center justify-center"
        >
          <span>View Post</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RideCard;