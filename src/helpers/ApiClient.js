import axios from "axios";
import { getAccessToken, clearAccessToken } from "./AuthStatus";
import { clearUserDetailsInLocalStorage } from "./userDetails";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Bearer Token
ApiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAccessToken();
      clearUserDetailsInLocalStorage();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default ApiClient;