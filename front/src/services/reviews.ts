import axios from 'axios';
import { Review } from '../interfaces/review';

const API_URL = 'http://localhost:3000/review';

export const createReview = async (reviewData: Review) => {
  try {
    const response = await axios.post(`${API_URL}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getAllReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getReviewById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    throw error;
  }
};

export const updateReview = async (id: number, reviewData: Review) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteReview = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const getPaginatedReviews = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${API_URL}/paginate`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated reviews:', error);
    throw error;
  }
};

export const searchReviews = async (searchTerm: string, fields: string[], page: number, limit: number) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { searchTerm, fields: fields.join(','), page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching reviews:', error);
    throw error;
  }
};

export const getReviewsByReviewedUser = async (reviewedUserId: number) => {
  try {
    const response = await axios.get(`${API_URL}/reviewedUser/${reviewedUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by reviewed user:', error);
    throw error;
  }
};


export const getReviewsByReviewer = async (reviewerId: number) => {
  try {
    const response = await axios.get(`${API_URL}/reviewer/${reviewerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by reviewer:', error);
    throw error;
  }
};

export const getReviewsByRide = async (rideId: number) => {
  try {
    const response = await axios.get(`${API_URL}/ride/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by ride ID:', error);
    throw error;
  }
};

export const getReviewsByReviewerAndRide = async (reviewerId: number, rideId: number) => {
  try {
    const response = await axios.get(`${API_URL}/reviewer/${reviewerId}/ride/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by reviewer and ride ID:', error);
    throw error;
  }
};
