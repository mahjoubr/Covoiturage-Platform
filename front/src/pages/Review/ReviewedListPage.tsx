import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyReviews, deleteReview } from '../../services/reviews';

import {
  Star, MapPin, Calendar, Clock, Edit, Trash2,
  ChevronRight, X, Filter, AlertTriangle,
  Send, ThumbsUp, ThumbsDown, Users
} from 'lucide-react';
import { Review } from '../../interfaces/Review';
import UpdateReviewModal from './updateReview';

const MyReviewsWithClient: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);

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
      setDeleteId(null);
    }
  };

  const handleUpdate = (id: number) => {
    const reviewToEdit = reviews.find(review => review.id === id);
    if (reviewToEdit) {
      setEditReview(reviewToEdit);
    }
  };

  const handleUpdateComplete = () => {
    // Refresh reviews after update
    getMyReviews()
      .then(setReviews)
      .catch((err: any) => console.error('Error refreshing reviews:', err));
  };

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'all') return true;
    if (activeTab === 'positive') return review.stars >= 4;
    if (activeTab === 'negative') return review.stars < 4;
    return true;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-opacity-50"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-blue-700 font-medium">Loading your feedback history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-xl shadow-xl border-l-4 border-red-500 max-w-md">
          <div className="flex items-center mb-4">
            <AlertTriangle size={24} className="text-red-500 mr-3" />
            <h3 className="text-xl font-bold text-red-600">Oops! Something went wrong</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center max-w-md px-6">
          <div className="relative">
            <div className="bg-white rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-8 shadow-xl">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 animate-pulse"></div>
              <Send size={40} className="text-blue-500 relative z-10" />
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
              <div className="w-40 h-40 bg-blue-200 rounded-full opacity-20 filter blur-xl absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">You Haven't Written Any Reviews</h2>
          <p className="text-blue-700 mb-8">Help the community by sharing your honest feedback about your travel companions.</p>
          <Link to="/rides" className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg px-6 py-3 font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Find Rides to Review
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-block mb-3 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">My Feedback</div>
          <h1 className="text-3xl font-bold text-blue-900 mb-3">Reviews You've Written</h1>
          <p className="text-blue-700 max-w-lg mx-auto">Your honest feedback helps other travelers make informed decisions.</p>
        </div>

        {/* Filter */}
        <div className="relative mb-8">
          <div className="flex justify-between items-center max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-1 flex justify-center">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                All Reviews
              </button>
              <button 
                onClick={() => setActiveTab('positive')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'positive' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Positive
              </button>
              <button 
                onClick={() => setActiveTab('negative')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'negative' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                Critical
              </button>
            </div>
            
            {/* Mobile filter button */}
            <button 
              className="md:hidden bg-white p-3 rounded-lg shadow-md"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <Filter size={18} className="text-blue-600" />
            </button>
          </div>
          
          {/* Mobile filter dropdown */}
          {isFilterMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-20 p-2 md:hidden">
              <button 
                onClick={() => {
                  setActiveTab('all');
                  setIsFilterMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                All Reviews
              </button>
              <button 
                onClick={() => {
                  setActiveTab('positive');
                  setIsFilterMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md ${activeTab === 'positive' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                Positive
              </button>
              <button 
                onClick={() => {
                  setActiveTab('negative');
                  setIsFilterMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md ${activeTab === 'negative' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
              >
                Critical
              </button>
            </div>
          )}
        </div>

        {/* Reviews Stats */}
        <div className="max-w-5xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Send size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <ThumbsUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Positive Ratings</p>
              <p className="text-2xl font-bold text-gray-800">
                {reviews.filter(r => r.stars >= 4).length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
              <Users size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">People Reviewed</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(reviews.map(r => r.user.id)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-lg border border-gray-100"
            >
              {/* Header with rating info */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex">
                    {renderStars(review.stars)}
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                
                {/* My rating summary */}
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    {review.stars >= 4 ? (
                      <ThumbsUp size={14} className="text-blue-600" />
                    ) : (
                      <ThumbsDown size={14} className="text-blue-600" />
                    )}
                  </div>
                  <p className="font-medium text-gray-800">
                    {review.stars >= 4 ? 'I had a great experience' : 'There were some issues'}
                  </p>
                </div>
              </div>
              
              {/* Separator */}
              <div className="h-px bg-gray-100 mx-5"></div>
              
              {/* Comment */}
              <div className="px-5 py-4 bg-gray-50 min-h-24">
                {review.comment ? (
                  <p className="text-gray-700">{review.comment}</p>
                ) : (
                  <p className="text-gray-500 italic">No written feedback provided</p>
                )}
              </div>
              
              {/* Trip Info */}
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                    <img
                      src={review.user.imageUrl || '/images/user/default_user.png'}
                      alt={`${review.user.name} ${review.user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.user.name} {review.user.lastName}
                    </h4>
                    <p className="text-xs text-gray-500">Review recipient</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin size={14} className="mr-1 text-blue-500" />
                  <span>{review.ride.departure}</span>
                  <ChevronRight size={12} className="mx-1 text-gray-400" />
                  <span>{review.ride.arrival}</span>
                </div>
                
                <div className="flex text-xs text-gray-500 mt-2">
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

              {/* Action Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                <Link
                  to={`/profile/${review.user.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View Profile
                </Link>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(review.id)}
                    className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Edit review"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(review.id)}
                    className="p-1.5 rounded-md bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 size={14} />
                  </button>
                  <Link
                    to={`/rides/${review.ride.id}`}
                    className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="View ride details"
                  >
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all animate-fade-in">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Delete Your Review</h3>
              </div>
              <button 
                onClick={() => setDeleteId(null)}
                className="text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="bg-red-50 rounded-lg p-4 mb-5 border-l-4 border-red-500">
              <p className="text-red-600">Are you sure you want to delete this review? This feedback will be permanently removed.</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Review Modal */}
      {editReview && (
        <UpdateReviewModal
          reviewId={editReview.id}
          initialStars={editReview.stars}
          initialComment={editReview.comment || ''}
          onClose={() => setEditReview(null)}
          onUpdated={handleUpdateComplete}
        />
      )}
    </div>
  );
};

export default MyReviewsWithClient;