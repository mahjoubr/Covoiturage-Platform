import { useState, useEffect } from 'react';
import { Link, } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  AlertTriangle, Send, ThumbsUp, Users, Star, MessageSquare
} from 'lucide-react';
import ReviewCard from '../../components/review/ReviewCard';
import { getMyReviews, getReceivedReviews, deleteReview } from '../../services/reviews';
import { getCurrentUserId } from '../../services/authService';
import { Review } from '../../interfaces/Review';
import DeleteConfirmationModal from './DeleteConfirmationModel';
import UpdateReviewModal from './updateReview';

const ReviewsPage = () => {
  const [activeView, setActiveView] = useState<'my-reviews' | 'received-reviews'>('my-reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6, 
    totalItems: 0,
    totalPages: 1
  });
  const [editingReview, setEditingReview] = useState<{
    id: number;
    stars: number;
    comment: string;
  } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);
  
  // Configuration based on active view
  const config = {
    'my-reviews': {
      title: "Reviews You've Written",
      subtitle: "Your honest feedback helps other travelers make informed decisions.",
      emptyTitle: "You Haven't Written Any Reviews",
      emptyMessage: "Help the community by sharing your honest feedback about your travel companions.",
      emptyIcon: Send,
      emptyCtaText: "Find Rides to Review",
      emptyCtaLink: "/rides",
      loadingMessage: "Loading your feedback history...",
      gradientColors: "bg-gradient-to-br from-blue-50 to-blue-100",
      accentColor: "blue",
      fetchFn: async (variables: { page: number, limit: number }) => {
        return getMyReviews(variables.page, variables.limit);
      },
      variant: "author" as 'author',
      stats: [
        { title: "Total Feedback", icon: Send, color: "blue", getValue: (reviews: Review[]) => reviews.length, iconFilled: false },
        { title: "Positive Ratings", icon: ThumbsUp, color: "green", getValue: (reviews: Review[]) => reviews.filter(r => r.stars >= 4).length, iconFilled: false },
        { title: "People Reviewed", icon: Users, color: "amber", getValue: (reviews: Review[]) => new Set(reviews.map(r => r.user.id)).size, iconFilled: false }
      ]
    },
    'received-reviews': {
      title: "Your Travel Memories",
      subtitle: "Revisit your journey experiences and the connections you've made along the way.",
      emptyTitle: "No Reviews Yet",
      emptyMessage: "Share your experiences and help others by leaving reviews for your past rides.",
      emptyIcon: Star,
      emptyCtaText: "Browse Your Rides",
      emptyCtaLink: "/rides",
      loadingMessage: "Loading your journey memories...",
      gradientColors: "bg-gradient-to-br from-indigo-50 to-purple-100",
      accentColor: "indigo",
      fetchFn: async (variables: { page: number, limit: number }) => {
        const userId = await getCurrentUserId();
        if (!userId) throw new Error('User ID is null');
        return getReceivedReviews(userId, variables.page, variables.limit);
      },
      variant: "recipient" as 'recipient',
      stats: [
        { title: "Total Reviews", icon: Star, color: "indigo", getValue: (reviews: Review[]) => reviews.length, iconFilled: false },
        { title: "Positive Reviews", icon: Star, color: "green", iconFilled: true, getValue: (reviews: Review[]) => reviews.filter(r => r.stars >= 4).length },
        { title: "With Comments", icon: MessageSquare, color: "blue", getValue: (reviews: Review[]) => reviews.filter(r => r.comment && r.comment.trim() !== '').length, iconFilled: false }
      ]
    }
  };

  const currentConfig = config[activeView];



const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= pagination.totalPages) {
    setPagination(prev => ({ ...prev, page: newPage }));
  }
};

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await currentConfig.fetchFn({
          page: pagination.page,
          limit: pagination.limit
        });
        
        setReviews(response.data);
        setPagination(prev => ({
          ...prev,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
          currentPage: response.currentPage
        }));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching reviews');
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, [activeView, pagination.page, activeTab]);
  const handleDeleteReview = (id: number) => {
    setReviewToDelete(id);
    setDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    
    try {
      await deleteReview(reviewToDelete);
      setReviews(reviews.filter(review => review.id !== reviewToDelete));
      setDeleteModalOpen(false);
      setReviewToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  const handleEditReview = (id: number) => {
    const reviewToEdit = reviews.find(review => review.id === id);
    if (reviewToEdit) {
      setEditingReview({
        id: reviewToEdit.id,
        stars: reviewToEdit.stars,
        comment: reviewToEdit.comment || ''
      });
    }
  };
  
  const handleUpdateComplete = async () => {
    try {
      const response = await currentConfig.fetchFn({
        page: pagination.page,
        limit: pagination.limit
      });
      setReviews(response.data);
      setPagination(prev => ({
        ...prev,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage
      }));
    } catch (err) {
      console.error('Error refreshing reviews:', err);
    }
  };
  


  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'all') return true;
    if (activeTab === 'positive') return review.stars >= 4;
    return review.stars < 4;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentConfig.gradientColors}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className={`absolute inset-0 rounded-full border-4 border-${currentConfig.accentColor}-200 border-opacity-50`}></div>
            <div className={`absolute inset-0 rounded-full border-4 border-${currentConfig.accentColor}-600 border-t-transparent animate-spin`}></div>
          </div>
          <p className={`mt-4 text-${currentConfig.accentColor}-700 font-medium`}>{currentConfig.loadingMessage}</p>
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
            Try Again
          </button>
        </div>
      </div>
    );
  }


  

  return (
    <div className={`min-h-screen ${currentConfig.gradientColors} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveView('my-reviews')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === 'my-reviews'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              My Reviews
            </button>
            <button
              onClick={() => setActiveView('received-reviews')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === 'received-reviews'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-indigo-50'
              }`}
            >
              Received Reviews
            </button>
          </div>
        </div>

        <div className="mb-10 text-center">
          <h1 className={`text-3xl font-bold ${
            activeView === 'received-reviews' 
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700' 
              : `text-${currentConfig.accentColor}-900`
          } mb-3`}>
            {currentConfig.title}
          </h1>
          <p className={`text-${currentConfig.accentColor}-700 max-w-lg mx-auto`}>
            {currentConfig.subtitle}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {currentConfig.stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md flex items-center">
                  <div className={`h-12 w-12 rounded-full bg-${stat.color}-100 flex items-center justify-center mr-4`}>
                    <Icon 
                      size={20} 
                      className={`text-${stat.color}-600`} 
                      fill={stat.iconFilled ? "currentColor" : "none"} 
                    />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.getValue(reviews)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {reviews.length === 0 ? (
  <div className="text-center max-w-md mx-auto px-6 mt-12">
    <div className="relative">
      <div className="bg-white rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-8 shadow-xl">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-${currentConfig.accentColor}-100 to-${currentConfig.accentColor}-50 animate-pulse`}></div>
        <currentConfig.emptyIcon size={40} className={`text-${currentConfig.accentColor}-500 relative z-10`} />
      </div>
    </div>
    <h2 className={`text-2xl font-bold text-${currentConfig.accentColor}-900 mb-3`}>
      {currentConfig.emptyTitle}
    </h2>
    <p className={`text-${currentConfig.accentColor}-700 mb-8`}>
      {currentConfig.emptyMessage}
    </p>
    <Link
      to={currentConfig.emptyCtaLink}
      className={`inline-block bg-gradient-to-r from-${currentConfig.accentColor}-600 to-${currentConfig.accentColor}-700 text-white rounded-lg px-6 py-3 font-medium hover:from-${currentConfig.accentColor}-700 hover:to-${currentConfig.accentColor}-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
    >
      {currentConfig.emptyCtaText}
    </Link>
  </div>
) : (
  <>
   

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? `bg-${currentConfig.accentColor}-600 text-white shadow-md`
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('positive')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'positive'
                  ? `bg-${currentConfig.accentColor}-600 text-white shadow-md`
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              Positive
            </button>
            <button
              onClick={() => setActiveTab('negative')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'negative'
                  ? `bg-${currentConfig.accentColor}-600 text-white shadow-md`
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              Negative
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredReviews.map((review) => (
           // Make sure you're passing the handleDeleteReview function
        
        
        <ReviewCard
        key={review.id}
        review={review}
        variant={currentConfig.variant}
        onEdit={currentConfig.variant === 'author' ? handleEditReview : undefined}
        onDelete={currentConfig.variant === 'author' ? handleDeleteReview : undefined}
        />
          ))}
        </div>
        </>
)}

      </div>
      <DeleteConfirmationModal
  isOpen={deleteModalOpen}
  onClose={() => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  }}
  onConfirm={confirmDelete}
/>
{editingReview && (
  <UpdateReviewModal
    reviewId={editingReview.id}
    initialStars={editingReview.stars}
    initialComment={editingReview.comment}
    onClose={() => setEditingReview(null)}
    onUpdated={handleUpdateComplete}
  />
)}


{pagination.totalPages > 1 && (
  <div className="flex justify-center mt-8">
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className={`p-2 rounded-md ${pagination.page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <ChevronLeft size={20} />
      </button>
      
      {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
        let pageNum;
        if (pagination.totalPages <= 5) {
          pageNum = i + 1;
        } else if (pagination.page <= 3) {
          pageNum = i + 1;
        } else if (pagination.page >= pagination.totalPages - 2) {
          pageNum = pagination.totalPages - 4 + i;
        } else {
          pageNum = pagination.page - 2 + i;
        }
        
        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-10 h-10 rounded-md flex items-center justify-center ${
              pageNum === pagination.page
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
        className={`p-2 rounded-md ${pagination.page === pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
)}

{/* Page info */}
<div className="text-center text-sm text-gray-600 mt-2">
  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
  {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of{' '}
  {pagination.totalItems} reviews
</div>
    </div>
  
);
};

export default ReviewsPage;

