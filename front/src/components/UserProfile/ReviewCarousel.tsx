import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '../../types';
import ReviewCard from './ReviewCard';

interface ReviewCarouselProps {
  reviews: Review[];
  itemsToShow?: number;
}

export default function ReviewCarousel({ reviews, itemsToShow = 3 }: ReviewCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsToShow >= reviews.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - itemsToShow : prevIndex - 1
    );
  };

  const visibleReviews = reviews.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 p-2 -translate-x-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          aria-label="Previous reviews"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="w-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 p-2 translate-x-full text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          aria-label="Next reviews"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: Math.ceil(reviews.length / itemsToShow) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * itemsToShow)}
            className={`w-2 h-2 rounded-full transition-colors ${
              Math.floor(currentIndex / itemsToShow) === index
                ? 'bg-gray-800 dark:bg-white'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to review set ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}