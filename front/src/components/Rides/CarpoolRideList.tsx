/*import React, { useState, useMemo } from 'react';
import { RidePost } from '../../types';
import RideCard from './RideCard';
import FilterButton from './FilterButton';

interface CarpoolRideListProps {
  rides: RidePost[];
  onView: (post: RidePost) => void;
}

type FilterType = 'yourRides' | 'ridesTaken' | null;

const CarpoolRideList: React.FC<CarpoolRideListProps> = ({ rides, onView }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  // Filter the rides based on the active filter
  const filteredRides = useMemo(() => {
    if (!activeFilter) return rides;
    
    if (activeFilter === 'yourRides') {
      return rides.filter(ride => ride.isYourRide);
    } else {
      return rides.filter(ride => ride.isRideYouTook);
    }
  }, [rides, activeFilter]);

  // Toggle filter function
  const toggleFilter = (filter: FilterType) => {
    if (activeFilter === filter) {
      // If the same filter is clicked again, disable it
      setActiveFilter(null);
    } else {
      // Otherwise, set this filter as active
      setActiveFilter(filter);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900 pt-8 py-8" >
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-4">
            Carpool Rides
          </h2>
          
          <div className="flex space-x-3 mb-6">
            <FilterButton 
              label="Your Rides" 
              isActive={activeFilter === 'yourRides'} 
              onClick={() => toggleFilter('yourRides')} 
            />
            <FilterButton 
              label="Rides You Took" 
              isActive={activeFilter === 'ridesTaken'} 
              onClick={() => toggleFilter('ridesTaken')} 
            />
          </div>
        </div>
        
        {filteredRides.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-white/70">No rides found with the current filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} onView={onView} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarpoolRideList;*/
import React, { useState, useMemo } from 'react';
import { RidePost } from '../../types';
import RideCard from './RideCard';
import FilterButton from './FilterButton';
import { CarpoolPost } from '../../types/posts';
import { mockCarpoolPosts } from '../../data/mockData';
import ViewPostModal from '../posts/ViewPostModal';

interface CarpoolRideListProps {
  rides: RidePost[];
  onView: (post: RidePost) => void;
}

type FilterType = 'yourRides' | 'ridesTaken' | null;

const CarpoolRideList: React.FC<CarpoolRideListProps> = ({ rides, onView }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  // Filter the rides based on the active filter
  const filteredRides = useMemo(() => {
    if (!activeFilter) return rides;
    
    if (activeFilter === 'yourRides') {
      return rides.filter(ride => ride.isYourRide);
    } else {
      return rides.filter(ride => ride.isRideYouTook);
    }
  }, [rides, activeFilter]);

  // Toggle filter function
  const toggleFilter = (filter: FilterType) => {
    if (activeFilter === filter) {
      // If the same filter is clicked again, disable it
      setActiveFilter(null);
    } else {
      // Otherwise, set this filter as active
      setActiveFilter(filter);
    }
  };
  const [selectedPost, setSelectedPost] = useState<CarpoolPost | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewPost = (postId: string) => {
    const post = mockCarpoolPosts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setIsViewModalOpen(true);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900 pt-8 py-8" >
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-4">
            Carpool Rides
          </h2>
          
          <div className="flex space-x-3 mb-6">
            <FilterButton 
              label="Your Rides" 
              isActive={activeFilter === 'yourRides'} 
              onClick={() => toggleFilter('yourRides')} 
            />
            <FilterButton 
              label="Rides You Took" 
              isActive={activeFilter === 'ridesTaken'} 
              onClick={() => toggleFilter('ridesTaken')} 
            />
          </div>
        </div>
        
        {filteredRides.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-white/70">No rides found with the current filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} onView={handleViewPost} />
            ))}

          </div>
        )}
      </div>
      <ViewPostModal 
  isOpen={isViewModalOpen}
  onClose={() => setIsViewModalOpen(false)}
  post={selectedPost}
/>

    </div>
  );
};

export default CarpoolRideList;