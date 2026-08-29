import { createContactAPI } from "../api/contact/contact.api";

const request = async (fn) => {
  try {
    const response = await fn();
    return response.data;
  } catch (error) {
    console.error("Contact Service Error:", error);
    throw error.response?.data || error;
  }
};

export const contactService = {
  sendMessage: (data) => request(() => createContactAPI(data)),
};