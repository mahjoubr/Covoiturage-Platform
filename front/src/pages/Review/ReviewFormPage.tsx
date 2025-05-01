import { useLocation } from 'react-router';
import ReviewForm from '../../components/review/ReviewForm';

const ReviewPage = () => {
  
  const ride = {
    date: '2025-04-30',
    departure: 'Tunise',
    arrival: 'Zaghouan',
    time: '10:00 AM',
    driverName: 'John Doe',
    price: 25.5,
    rideId: 123456
  };


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewedId = queryParams.get('reviewedId');
  const rideId = queryParams.get('rideId');
  if (!rideId || !reviewedId) {
    console.error('Missing rideId or reviewedId in query parameters');
    return null; // or handle the error as needed
  }

  const handleReviewSubmitted = () => {
    console.log('Review was submitted successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ride Details</h1>
      
      {/* Ride Information Card */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <img 
              src="../../../public/images/user/user-06.jpg"
              alt={ride.driverName}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Ride with {ride.driverName}</h3>
            <p className="text-gray-500 text-sm">{ride.date}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Departure</p>
            <p className="font-medium">{ride.departure}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Arrival</p>
            <p className="font-medium">{ride.arrival}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Price</p>
            <p className="font-medium text-lg">${ride.price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Time</p>
            <p className="font-medium">{ride.time}</p>
          </div>
        </div>
      </div>
      
      {/* Review Form Component */}
      <ReviewForm 
        rideId={Number(rideId)}
        reviewedId={Number(reviewedId)}
        onReviewSubmitted={handleReviewSubmitted} 
      />
    </div>
  );
};

export default ReviewPage;