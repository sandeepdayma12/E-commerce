import { orderAPI } from "../instances";

export const createOrderAPI = (data) => orderAPI.post("/orders/", data);
export const getMyOrdersAPI = () => orderAPI.get("/orders/");
