import { orderAPI } from "./instances";

export const createOrderAPI = (data) => orderAPI.post("/order", data);
export const getMyOrdersAPI = () => orderAPI.get("/order/my-orders");
