import axiosClient from "../api/axiosClient";

// Get user profile
export const getUserProfile = (userId) =>
  axiosClient.get(`/users/${userId}`).then(r => r.data);

// Update user profile
export const updateUserProfile = (userId, data) =>
  axiosClient.put(`/users/${userId}`, data).then(r => r.data);

// Get user reviews
export const getUserReviews = (userId, page = 1, pageSize = 10) =>
  axiosClient.get(`/users/${userId}/reviews?page=${page}&pageSize=${pageSize}`).then(r => r.data);

// Follow a user
export const followUser = (userId) =>
  axiosClient.post(`/users/${userId}/follow`).then(r => r.data);

// Unfollow a user
export const unfollowUser = (userId) =>
  axiosClient.delete(`/users/${userId}/follow`).then(r => r.data);

// Get follow status
export const getFollowStatus = (userId) =>
  axiosClient.get(`/users/${userId}/follow-status`).then(r => r.data);
