import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {getReceivedReviews } from '../../services/reviews';
import { 
  Star, MapPin, Calendar, Clock,User, 
  ChevronRight, MessageSquare, Filter, AlertTriangle 
} from 'lucide-react';

import { Review } from '../../interfaces/Review';
import { getCurrentUserId } from '../../services/authService';
const MyReceivedReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    getCurrentUserId()
      .then((userId) => {
        if (userId !== null) {
          return getReceivedReviews(userId);
        } else {
          throw new Error('User ID is null');
        }
      })
      .then(setReviews)
      .catch((err: any) => setError(err.message || 'Error fetching reviews'))
      .finally(() => setLoading(false));
  }, []);



  

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-opacity-50"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-indigo-700 font-medium">Loading your journey memories...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="text-center max-w-md px-6">
          <div className="relative">
            <div className="bg-white rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-8 shadow-xl">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 animate-pulse"></div>
              <Star size={40} className="text-indigo-500 relative z-10" />
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
              <div className="w-40 h-40 bg-purple-200 rounded-full opacity-20 filter blur-xl absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-indigo-900 mb-3">No Reviews Yet</h2>
          <p className="text-indigo-700 mb-8">Share your experiences and help others by leaving reviews for your past rides.</p>
          <Link to="/rides" className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-6 py-3 font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Browse Your Rides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-block mb-3 bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium">Your Travel Journey</div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 mb-3">Your Travel Memories</h1>
          <p className="text-indigo-600 max-w-lg mx-auto">Revisit your journey experiences and the connections you've made along the way.</p>
        </div>

        {/* Filter */}
        <div className="relative mb-8">
          <div className="flex justify-between items-center max-w-5xl mx-auto">
            <div className="bg-white rounded-full shadow-md p-1 flex justify-center">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'all' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                All Reviews
              </button>
              <button 
                onClick={() => setActiveTab('positive')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'positive' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Positive
              </button>
              <button 
                onClick={() => setActiveTab('negative')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'negative' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Needs Improvement
              </button>
            </div>
            
            {/* Mobile filter button */}
            <button 
              className="md:hidden bg-white p-3 rounded-full shadow-md"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <Filter size={18} className="text-indigo-600" />
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
                className={`block w-full text-left px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'}`}
              >
                All Reviews
              </button>
              <button 
                onClick={() => {
                  setActiveTab('positive');
                  setIsFilterMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md ${activeTab === 'positive' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'}`}
              >
                Positive
              </button>
              <button 
                onClick={() => {
                  setActiveTab('negative');
                  setIsFilterMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md ${activeTab === 'negative' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'}`}
              >
                Needs Improvement
              </button>
            </div>
          )}
        </div>

        {/* Reviews Stats */}
        <div className="max-w-5xl mx-auto mb-8 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <Star size={20} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-800">{reviews.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <Star size={20} className="text-green-600" fill="currentColor" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Positive Reviews</p>
              <p className="text-2xl font-bold text-gray-800">
                {reviews.filter(r => r.stars >= 4).length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">With Comments</p>
              <p className="text-2xl font-bold text-gray-800">
                {reviews.filter(r => r.comment && r.comment.trim() !== '').length}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Top Section with User Info */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white flex items-center">
                <div className="relative">
                <img
                src={review.user.imageUrl || '/images/user/default_user.png'}
                alt={`${review.user.name} ${review.user.lastName}`}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <div className="bg-green-500 rounded-full h-3 w-3"></div>
                  </div>
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-bold text-lg">
                    {review.user.name} {review.user.lastName}
                  </h3>
                  <div className="flex mt-1">
                    {renderStars(review.stars)}
                  </div>
                </div>
                <Link 
                  to={`/users/${review.user.id}`} 
                  className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <User size={16} />
                </Link>
              </div>

              {/* Trip Info */}
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center text-gray-800 mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                    <MapPin size={16} className="text-indigo-600" />
                  </div>
                  <div className="font-medium">
                    <span>{review.ride.departure}</span>
                    <ChevronRight size={14} className="inline mx-1 text-indigo-400" />
                    <span>{review.ride.arrival}</span>
                  </div>
                </div>
                <div className="flex text-sm text-gray-500 pl-1">
                  <div className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1.5 text-indigo-400" />
                    <span>{new Date(review.ride.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1.5 text-indigo-400" />
                    <span>{review.ride.time}</span>
                  </div>
                </div>
              </div>

              {/* Comment */}
              {review.comment ? (
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-24 flex items-center">
                  <div className="text-indigo-900 text-opacity-20 absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zM17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.317.143-.686.238-1.028.467-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z" />
                    </svg>
                  </div>
                  <p className="italic text-gray-700 relative z-10 font-light">"{review.comment}"</p>
                </div>
              ) : (
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-24 flex items-center justify-center">
                  <p className="text-gray-500 text-sm text-center">No comments for this journey</p>
                </div>
              )}

              {/* Footer with Date and Actions */}
              <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Posted on {new Date(review.date).toLocaleDateString()}
                </span>
               
              </div>
            </div>
          ))}
        </div>
      </div>

   
    </div>
  );
};

export default MyReceivedReviews;