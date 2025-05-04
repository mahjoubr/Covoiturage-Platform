import React, { useState, useMemo, useEffect } from 'react';
import RideCard from './RideCard';
import FilterButton from './FilterButton';
import { CarpoolPost, Ride, RideState } from '../../types/posts';
import ViewPostModal from '../posts/ViewPostModal';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_RIDES_BY_DRIVER, GET_RIDES_BY_PASSENGER, GET_USER } from '../../graphQl/queries/rides';
import { useNavigate } from 'react-router-dom';
import { GET_POST_BY_ID } from '../../graphQl/queries/posts';

interface CarpoolRideListProps {
  onView?: (post: Ride) => void;
}

type FilterType = 'yourRides' | 'ridesTaken' | null;

const CarpoolRideList: React.FC<CarpoolRideListProps> = ({ onView }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [selectedPost, setSelectedPost] = useState<CarpoolPost | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Check authentication first
  const token = localStorage.getItem('auth_token');
  const isLoggedIn = !!token;

  // Fetch user data only if logged in
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log('GET_USER completed:', data),
    onError: (error) => console.error('GET_USER error:', error),
  });
  const userInfo = userData?.getAppUserInfo || {};
  const { data: driverRidesData, loading: driverLoading } = useQuery(GET_RIDES_BY_DRIVER, {
    skip: !isLoggedIn || !userData,
    onCompleted: (data) => console.log('GET_RIDES_BY_DRIVER completed:', data),
    onError: (error) => console.error('GET_RIDES_BY_DRIVER error:', error),
  });
  
  const { data: passengerRidesData, loading: passengerLoading } = useQuery(GET_RIDES_BY_PASSENGER, {
    skip: !isLoggedIn || !userData,
    onCompleted: (data) => console.log('GET_RIDES_BY_PASSENGER completed:', data),
    onError: (error) => console.error('GET_RIDES_BY_PASSENGER error:', error),
  });

  // Use a separate lazy query for getting post details
  const [getPost, { loading: postLoading }] = useLazyQuery(GET_POST_BY_ID, {
    onCompleted: (data) => {
      // Only process the data when the query actually completes
      if (data && data.getPostById) {
        const post = data.getPostById;
        const formattedPost: CarpoolPost = {
          id: post.id.toString(),
          destination: post.destination,
          departure: post.departure,
          date: post.date,
          time: post.time,
          seatCount: post.seatCount,
          frequency: post.frequency,
          description: post.description,
          price: post.price,
          contactInfo: post.contactInfo,
          driverName:
            post.postOwner?.name && post.postOwner?.lastName
              ? `${post.postOwner.name} ${post.postOwner.lastName}`
              : "Unknown",
          comments: post.comments ?? [],
          postOwnerId:post.postOwner.id,
        };
        setSelectedPost(formattedPost);
        setIsViewModalOpen(true);
      }
    },
    onError: (error) => {
      console.error("Error fetching post:", error);
      // You might want to show an error message to the user here
    }
  });

  useEffect(() => {
    if (!driverRidesData && !passengerRidesData) return;
  
    const formattedRides: Ride[] = [];
  
    if (driverRidesData?.getRidesByDriver) {
      driverRidesData.getRidesByDriver.forEach((ride: any) => {
        formattedRides.push({
          id: ride.id,
          date: ride.date,
          departure: ride.departure,
          arrival: ride.arrival,
          isYourRide: true,
          isRideYouTook: false,
          post: ride.post?.id,
          time: ride.date ? new Date(ride.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          price: ride.price || 0,
          nbPassengers: ride.nbPassengers || 0,
          state: ride.state || RideState.NOT_STARTED,
          appUserRides: [],
          driver: ride.post?.driverName
        });
      });
    }
  
    if (passengerRidesData?.getRidesByPassenger) {
      passengerRidesData.getRidesByPassenger.forEach((ride: any) => {
        formattedRides.push({
          id: ride.id,
          date: ride.date,
          departure: ride.departure,
          arrival: ride.arrival,
          isYourRide: false,
          isRideYouTook: true,
          post: ride.post?.id,
          time: ride.date ? new Date(ride.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          price: ride.price || 0,
          nbPassengers: ride.nbPassengers || 0,
          state: ride.state || RideState.NOT_STARTED,
          appUserRides: [],
          driver: ride.post?.driverName
        });
      });
    }
  
    setRides(formattedRides);
  }, [driverRidesData, passengerRidesData]);
  
  const filteredRides = useMemo(() => {
    if (!activeFilter) return rides;
    return activeFilter === 'yourRides'
      ? rides.filter(ride => ride.isYourRide)
      : rides.filter(ride => ride.isRideYouTook);
  }, [rides, activeFilter]);

  const toggleFilter = (filter: FilterType) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleViewPost = (postId: string) => {
    // Just initiate the query and let the onCompleted handler do the rest
    getPost({ variables: { id: postId } });
  };

  // Loading state for user not logged in
  if (!isLoggedIn) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-600 dark:text-white/70">Please log in to view your rides</p>
          <button
            onClick={() => navigate('/signin')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state for data fetching
  if (userLoading || driverLoading || passengerLoading) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-600 dark:text-white/70">Loading rides...</p>
        </div>
      </div>
    );
  }

  // Error handling
  if (userError) {
    return (
      <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-red-500 dark:text-red-400">Error loading user data: {userError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900 pt-8 py-8">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-4">Carpool Rides</h2>
          <div className="flex space-x-3 mb-6">
            <FilterButton label="Your Rides" isActive={activeFilter === 'yourRides'} onClick={() => toggleFilter('yourRides')} />
            <FilterButton label="Rides You Took" isActive={activeFilter === 'ridesTaken'} onClick={() => toggleFilter('ridesTaken')} />
          </div>
        </div>

        {filteredRides.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-white/70">
              {activeFilter === 'yourRides'
                ? "You haven't created any rides yet"
                : activeFilter === 'ridesTaken'
                ? "You haven't joined any rides yet"
                : 'No rides available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredRides.map((ride) => (
              <RideCard 
                key={ride.id} 
                ride={ride} 
                onView={() => handleViewPost(String(ride.post))} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Add a loading indicator when fetching post details */}
      {postLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <p className="text-gray-700 dark:text-white">Loading post details...</p>
          </div>
        </div>
      )}

      <ViewPostModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        post={selectedPost} 
        userData={userInfo}
      />
    </div>
  );
};

export default CarpoolRideList;