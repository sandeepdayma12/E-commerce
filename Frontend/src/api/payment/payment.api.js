import { paymentAPI } from "../instances";

export const createPaymentIntentAPI = (data) =>
  paymentAPI.post("/payments/create-payment-intent", data);
