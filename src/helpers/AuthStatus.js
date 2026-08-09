import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "kithula_access_token";

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Time in seconds

    // Check if current time is less than token expiration (exp claim)
    if (decoded.exp && decoded.exp < currentTime) {
      return false; // Token has expired
    }
    return true;
  } catch (error) {
    return false; // Invalid token structure
  }
};

export const saveAccessToken = (token) => {
  // Set Cookie expiration matching JWT token time (~60 mins = 1/24 day)
  const tokenExpiryDays = 1 / 24; 

  Cookies.set(ACCESS_TOKEN_KEY, token, { expires: tokenExpiryDays, path: "/" });
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const isAdminAuthenticated = () => {
  const token = getAccessToken();
  const valid = isTokenValid(token);

  // Auto-clear token if it's expired
  if (token && !valid) {
    clearAccessToken();
    localStorage.clear();
  }

  return valid;
};