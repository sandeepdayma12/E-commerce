import { orderAPI } from '../api/instances.js';

export const getAdminStats = async () => {
  try {
    const response = await orderAPI.get('/orders/admin/dashboard/analytics', {
      params: { days: 30 }
    });
    const data = response.data;
    const analytics = data?.analytics || [];
    const salesData = analytics.map((item) => ({
      month: item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short' }) : 'Unknown',
      sales: Number(item.total_sales || 0),
    }));
    return {
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: analytics.reduce((sum, item) => sum + Number(item.total_sales || 0), 0),
      totalProducts: 0,
      salesData,
    };
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    throw error;
  }
};

export const getRecentOrders = async () => {
  try {
    const response = await orderAPI.get('/orders/admin/orders/recent');
    const orders = response.data || [];
    return orders.map((order) => {
      const productName = order.items?.[0]?.product_name || 'Order item';
      return {
        id: order.id,
        user_name: `User ${order.user_id}`,
        product_name: productName,
        status: order.status || 'pending',
        total_amount: order.total_amount,
        created_at: order.created_at,
      };
    });
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    throw error;
  }
};

