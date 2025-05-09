import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../../services/authService";
import { RideUser } from "../../services/ridesService";

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  users: RideUser[];
  rideId: number | string;  // Accept string or number to handle both types
}

const UsersPerRide: React.FC<ReviewPopupProps> = ({ 
  isOpen, 
  onClose, 
  users, 
  rideId 
}) => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };

    fetchCurrentUserId();
  }, []);

  if (!isOpen) return null;

  const handleUserSelect = (user: RideUser) => {
    if (user.id !== currentUserId) {
      // Redirect to the ReviewPage with rideId and reviewedId
      navigate(`/review?rideId=${rideId}&reviewedId=${user.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Popup container */}
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Select User to Review
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close popup"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {users.length > 0 ? (
              users.map((user) => (
                <div 
                  key={user.id}
                  className={`flex items-center p-3 ${
                    user.id !== currentUserId ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : "opacity-70"
                  } rounded-lg transition-colors`}
                  onClick={() => user.id !== currentUserId && handleUserSelect(user)}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 mr-3 overflow-hidden">
                    {user.imageUrl && (
                      <img 
                        src={user.imageUrl} 
                        alt={`${user.name} ${user.lastName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {user.name} {user.lastName}
                      {user.id === currentUserId && " (You)"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.roleInRide}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No users found to review
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPerRide;