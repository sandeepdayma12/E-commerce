import { adminAPI } from '../api/instances.js';

export const getAdminStats = async () => {
  try {
    const response = await adminAPI.get('/api/admin/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    throw error;
  }
};

export const getRecentOrders = async () => {
  try {
    const response = await adminAPI.get('/api/admin/recent-orders');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    throw error;
  }
};

