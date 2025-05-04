// src/pages/ReviewsPage.tsx
import React from 'react';
import MyReviewsWithClient from '../../components/review/ReviewedList';

const ReviewsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      <MyReviewsWithClient />
    </div>
  );
};

export default ReviewsPage;
