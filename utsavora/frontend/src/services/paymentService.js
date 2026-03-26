import API from "./api";

export const createPaymentOrder = (bookingId) => {
  return API.post("/payments/create-order/", { booking_id: bookingId });
};

export const verifyPayment = (data) => {
  return API.post("/payments/verify/", data);
};
