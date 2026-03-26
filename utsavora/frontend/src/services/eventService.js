import API from "./api";

export const createEvent = (data) => {
  return API.post("events/create/", data);
};

export const getMyEvents = () => {
  return API.get("events/my-events/");
};

export const getEventDetail = (id) => {
  return API.get(`events/${id}/`);
};

export const getPublicEvents = (params) => {
  return API.get("events/public/", { params });
};
