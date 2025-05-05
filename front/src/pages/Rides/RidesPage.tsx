import CarpoolRideList from '../../components/Rides/CarpoolRideList';
import { sampleRides } from '../../data/mockData';
import { RidePost } from '../../types';
function Rides() {
    const handleViewRide = (post: RidePost) => {
      console.log('Viewing post:', post);
    };
  
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <CarpoolRideList rides={sampleRides} onView={handleViewRide} />
      </div>
    );
  }
  
  export default Rides;