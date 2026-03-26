import API from "./api";

export const createBooking = (data) => {
  return API.post("bookings/create/", data);
};

export const getManagerBookings = () => {
  return API.get("bookings/manager/");
};

export const acceptBooking = (id) => {
  return API.post(`bookings/accept/${id}/`);
};

export const rejectBooking = (id) => {
  return API.post(`bookings/reject/${id}/`);
};

export const getUserBookings = () => {
  return API.get("bookings/list/");
};

