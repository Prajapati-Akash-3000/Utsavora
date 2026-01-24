import api from "./api";

export const login = async (data) => {
  // Corrected endpoint to match user request: /auth/login/
  const res = await api.post("/auth/login/", data);
  if (res.data.access) {
      localStorage.setItem("access", res.data.access);
  }
  return res.data;
};
