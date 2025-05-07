import { Star, MapPin, Calendar, Clock, Edit, Trash2, ChevronRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Review } from '../../interfaces/Review';

interface ReviewCardProps {
  review: Review;
  variant: 'author' | 'recipient';
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  currentUserId?: number;
}

const ReviewCard = ({ 
  review, 
  variant,
  onEdit,
  onDelete,
}: ReviewCardProps) => {
  // Determine if current user is the author
  console.log("current role", variant);
  const isAuthor = variant === 'author';
  console.log("isAuthor", isAuthor);
  
  // Render star rating
  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < count ? "text-yellow-400" : "text-gray-300"}
        fill={i < count ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${
      isAuthor ? 'border-blue-100' : 'border-indigo-100'
    }`}>
      {/* Header Section */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            {renderStars(review.stars)}
            <span className="ml-2 text-sm font-medium text-gray-700">
              {review.stars >= 4 ? 'Positive' : 'Needs Improvement'}
            </span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {new Date(review.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Comment Section */}
      <div className="px-5 py-4 bg-gray-50 min-h-24 border-t border-gray-100">
        {review.comment ? (
          <p className="text-gray-700">{review.comment}</p>
        ) : (
          <p className="text-gray-500 italic">No written feedback provided</p>
        )}
      </div>

      {/* User Info Section */}
      <div className="px-5 py-4 border-t border-gray-100">
        <div className="flex items-center mb-3">
          <div className="relative mr-3">
            <img
              src={review.user.imageUrl || '/default-user.png'}
              alt={`${review.user.name} ${review.user.lastName || ''}`}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            {isAuthor && (
              <div className="absolute -bottom-1 -right-1 bg-blue-100 rounded-full p-0.5">
                <User size={12} className="text-blue-600" />
              </div>
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {review.user.name} {review.user.lastName}
            </h4>
            <p className="text-xs text-gray-500">
              {isAuthor ? 'You reviewed this user' : 'Review from this user'}
            </p>
          </div>
        </div>

        {/* Ride Info */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin size={14} className="mr-1 text-blue-500" />
          <span>{review.ride.departure}</span>
          <ChevronRight size={12} className="mx-1 text-gray-400" />
          <span>{review.ride.arrival}</span>
        </div>

        <div className="flex text-xs text-gray-500">
          <div className="flex items-center mr-3">
            <Calendar size={12} className="mr-1 text-gray-400" />
            <span>{new Date(review.ride.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock size={12} className="mr-1 text-gray-400" />
            <span>{review.ride.time}</span>
          </div>
        </div>
      </div>

      {/* Action Footer - Only show for author view */}
      {isAuthor && (
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <Link
            to={`/users/${review.user.id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Profile
          </Link>

          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(review.id)}
                className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                title="Edit review"
              >
                <Edit size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review.id)}
                className="p-1.5 rounded-md bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                title="Delete review"
              >
                <Trash2 size={14} />
              </button>
            )}
            <Link
              to={`/rides/${review.ride.id}`}
              className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="View ride details"
            >
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;