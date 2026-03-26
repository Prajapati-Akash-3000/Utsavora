
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 15000, // 15 seconds timeout
});

// attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Do not intercept 401s for login endpoints to prevent page refresh bugs
    if (original.url?.includes('/auth/login/') || original.url?.includes('/auth/token/')) {
        return Promise.reject(err);
    }

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) {
             throw new Error("No refresh token");
        }

        const res = await axios.post(
          "http://127.0.0.1:8000/api/auth/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        
        // Update default headers for subsequent requests
        api.defaults.headers.Authorization = `Bearer ${newAccess}`;
        // Update headers for the retry
        original.headers.Authorization = `Bearer ${newAccess}`;

        return api(original);
      } catch (refreshErr) {
        // If refresh fails, maybe redirect to login or just reject
        // Clean up tokens if refresh fails
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        
        // Only redirect to login if we aren't already on a login or register page
        const pathname = window.location.pathname;
        if (!pathname.includes("/login") && !pathname.includes("/register")) {
            window.location.href = "/login/user";
        }
        
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
