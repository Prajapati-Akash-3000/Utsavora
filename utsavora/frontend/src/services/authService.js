import API from "./api";

export const login = (data) => {
  return API.post("auth/login/", data);
};

export const register = (data) => {
  return API.post("auth/register/", data);
};

export const getProfile = () => {
  return API.get("accounts/profile/");
};
