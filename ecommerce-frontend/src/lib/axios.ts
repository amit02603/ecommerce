import axios from "axios";

// Create a single axios instance that all API service files will use.
// Setting the baseURL here means we don't have to repeat it in every request.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // Sends cookies (JWT) automatically with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — runs before every request is sent.
// We read the auth token from localStorage and attach it to the Authorization header.
apiClient.interceptors.request.use(
  function (config) {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor — runs after every response arrives.
// If we get a 401 Unauthorized, the session has expired, so we clear local storage.
apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
