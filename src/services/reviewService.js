import axiosClient from "../api/axiosClient";

// Get reviews for a movie
export const getMovieReviews = (movieId, page = 1, pageSize = 10) =>
  axiosClient.get(`/movies/${movieId}/reviews?page=${page}&pageSize=${pageSize}`).then(r => r.data);

// Create a review for a movie
export const createReview = (movieId, data) =>
  axiosClient.post(`/movies/${movieId}/reviews`, data).then(r => r.data);

// Update a review
export const updateReview = (movieId, reviewId, data) =>
  axiosClient.put(`/movies/${movieId}/reviews/${reviewId}`, data).then(r => r.data);

// Delete a review
export const deleteReview = (movieId, reviewId) =>
  axiosClient.delete(`/movies/${movieId}/reviews/${reviewId}`).then(r => r.data);

// Toggle like on a review
export const toggleLike = (movieId, reviewId) =>
  axiosClient.post(`/movies/${movieId}/reviews/${reviewId}/like`).then(r => r.data);

// Get comments for a review
export const getReviewComments = (movieId, reviewId, page = 1) =>
  axiosClient.get(`/movies/${movieId}/reviews/${reviewId}/comments?page=${page}`).then(r => r.data);

// Add a comment to a review
export const addComment = (movieId, reviewId, data) =>
  axiosClient.post(`/movies/${movieId}/reviews/${reviewId}/comments`, data).then(r => r.data);

// Delete a comment
export const deleteComment = (movieId, reviewId, commentId) =>
  axiosClient.delete(`/movies/${movieId}/reviews/${reviewId}/comments/${commentId}`).then(r => r.data);
