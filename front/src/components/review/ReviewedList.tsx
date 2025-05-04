import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyReviews, deleteReview } from '../../services/reviews';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  ride: {
    id: number;
    departure: string;
    arrival: string;
    date: string;
    time: string;
  };
  reviewedUser: {
    id: number;
    name: string;
    lastName?: string;
    imageUrl?: string;
  };
}

const MyReviewsWithClient: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null); // store which review to delete
  const navigate = useNavigate();

  useEffect(() => {
    getMyReviews()
      .then(setReviews)
      .catch((err: any) => setError(err.message || 'Error fetching reviews'))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteReview(deleteId);
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeleteId(null); // Close modal
    }
  };

  const handleUpdate = (id: number) => {
    navigate(`/reviews/edit?reviewId=${id}`);
  };

  if (loading) return <p className="p-4 text-center text-gray-500">Loading your reviews…</p>;
  if (error) return <p className="p-4 text-center text-red-500">Error: {error}</p>;
  if (reviews.length === 0)
    return <p className="p-4 text-center text-gray-600">You haven’t left any reviews yet.</p>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl shadow border p-5 space-y-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center text-yellow-500 font-medium text-lg">
                  <Star size={18} fill="currentColor" className="mr-1" />
                  {r.rating}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right text-sm space-y-1">
                <Link to={`/users/${r.reviewedUser.id}`} className="text-blue-600 hover:underline block">
                  View Profile
                </Link>
                <Link to={`/rides/${r.ride.id}`} className="text-blue-600 hover:underline block">
                  View Ride
                </Link>
              </div>
            </div>

            {r.comment && (
              <p className="text-gray-700 text-sm border-l-4 border-blue-100 pl-3 italic">
                “{r.comment}”
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Ride</h4>
                <p className="text-gray-600">{r.ride.departure} → {r.ride.arrival}</p>
                <p className="text-gray-500 text-xs">{r.ride.date} at {r.ride.time}</p>
              </div>
              <div className="flex items-center">
                <img
                  src={r.reviewedUser.imageUrl || '/images/user-06.jpg'}
                  alt={`${r.reviewedUser.name} ${r.reviewedUser.lastName}`}
                  className="w-10 h-10 rounded-full object-cover mr-3 border"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {r.reviewedUser.name} {r.reviewedUser.lastName}
                  </p>
                  <p className="text-xs text-gray-500">Reviewed user</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => handleUpdate(r.id)}
                className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
              >
                Update
              </button>
              <button
                onClick={() => setDeleteId(r.id)}
                className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Delete Review</h3>
            <p className="text-sm text-gray-600">Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="text-sm px-4 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="text-sm px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewsWithClient;
