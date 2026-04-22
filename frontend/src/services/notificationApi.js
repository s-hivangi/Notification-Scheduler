import apiClient from '../API/apiclient';

export const notificationApi = {
  // Create a new notification
  createNotification: async (notification) => {
    const response = await apiClient.post('/', notification);
    return response.data;
  },

  // Get all notifications
  getNotifications: async () => {
    const response = await apiClient.get('/');
    return response.data;
  },

  // Get a specific notification by ID
  getNotificationById: async (id) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  // Update a notification
  updateNotification: async (id, notification) => {
    const response = await apiClient.patch(`/${id}`, notification);
    return response.data;
  },

  // Delete a notification
  deleteNotification: async (id) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },

  // Get heap snapshot for debugging
  getHeapSnapshot: async () => {
    const response = await apiClient.get('/debug/heap');
    return response.data;
  },
};
