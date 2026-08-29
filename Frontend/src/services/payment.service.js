import { createPaymentIntentAPI } from "../api/payment/payment.api";

const request = async (fn) => {
  try {
    const response = await fn();
    return response.data;
  } catch (error) {
    console.error("Payment Service Error:", error);
    throw error.response?.data || error;
  }
};

export const PaymentService = {
  createPaymentIntent: (payload) =>
    request(() => createPaymentIntentAPI(payload)),
};
