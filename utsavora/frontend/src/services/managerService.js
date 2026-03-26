import API from "./api";

export const getManagerAvailability = () => {
  return API.get("accounts/manager/availability/");
};

export const blockDate = (data) => {
  return API.post("accounts/manager/availability/add/", data);
};

export const getManagerPackages = () => {
  return API.get("manager/packages/");
};
