import { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';

interface ReviewFormProps {
  rideId: number;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ rideId, onReviewSubmitted }) => {
  const [stars, setStars] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Data to be sent to the backend
    const reviewData = {
      stars,
      comment,
      rideId,
    };

    try {
      // Simulate API call
      setTimeout(() => {
        console.log('Review submitted:', reviewData);
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        // Reset form after showing success message briefly
        setTimeout(() => {
          setStars(0);
          setComment('');
          setIsSubmitted(false);
          onReviewSubmitted(); // Notify parent component
        }, 3000);
      }, 1000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      {isSubmitted ? (
        <div className="text-center py-4">
          <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
          <h3 className="text-lg font-semibold text-green-700">Thank you for your review!</h3>
          <p className="text-green-600">Your feedback helps improve our service.</p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              {/* Star Rating */}
              <div className="mb-4 md:mb-0 md:w-1/3">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStars(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        fill={star <= stars ? "#FFD700" : "none"}
                        color={star <= stars ? "#FFD700" : "#CBD5E0"}
                        size={28}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Comment Field */}
              <div className="md:w-2/3">
                <label htmlFor="comment" className="block text-gray-700 mb-2" >
                  Comment
                </label>
                <textarea
                 required
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this ride..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting || stars === 0}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  stars === 0 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ReviewForm;