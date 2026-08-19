import axios from "axios";
import { 
  getAccessToken, 
  isTokenValid, 
  logoutAndRedirect 
} from "./AuthStatus";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const ApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Checks token validity BEFORE dispatching
ApiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      if (!isTokenValid(token)) {
        logoutAndRedirect();
        return Promise.reject(new Error("Session expired. Redirecting to login."));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catches 401 from FastAPI
ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logoutAndRedirect();
    }
    return Promise.reject(error);
  }
);

export default ApiClient;