import { orderAPI } from "../api/instances";

const request = async (fn) => {
  try {
    const response = await fn();
    return response.data;
  } catch (error) {
    console.error("Order Service Error:", error);
    throw error.response?.data || error;
  }
};

export const OrderService = {
  //Get User Orders
  getUserOrders: () =>
    request(() => orderAPI.get("/orders/")),

  //Create Order
  createOrder: (orderData) =>
    request(() => orderAPI.post("/orders/", orderData)),

  //Get Single Order by ID
  getOrderById: (orderId) =>
    request(() => orderAPI.get(`/orders/${orderId}`)),

  //Cancel Order by ID
  cancelOrder: (orderId) =>
    request(() => orderAPI.patch(`/orders/${orderId}/cancel`)),

  // Update Order Status (Admin Only)
  updateOrderStatus: (orderId, statusData) =>
    request(() =>
      orderAPI.patch(`/orders/${orderId}/update-status`, statusData)
    ),
};
