import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { clearUserDetailsInLocalStorage } from "./userDetails";

const ACCESS_TOKEN_KEY = "kithula_access_token";
let logoutTimer = null;

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Epoch in seconds
    return decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const logoutAndRedirect = (loginPath = "/admin/login") => {
  if (logoutTimer) clearTimeout(logoutTimer);
  clearAccessToken();
  clearUserDetailsInLocalStorage();

  // Avoid redirect loops if already on login page
  if (window.location.pathname !== loginPath) {
    window.location.href = loginPath;
  }
};

export const scheduleTokenExpiryLogout = (token) => {
  if (logoutTimer) clearTimeout(logoutTimer);
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeLeftMs = (decoded.exp - currentTime) * 1000;

    if (timeLeftMs <= 0) {
      logoutAndRedirect();
    } else {
      // Auto-logs out at the exact millisecond determined by backend exp
      logoutTimer = setTimeout(() => {
        logoutAndRedirect();
      }, timeLeftMs);
    }
  } catch {
    logoutAndRedirect();
  }
};

export const saveAccessToken = (token) => {
  try {
    const decoded = jwtDecode(token);

    // Set cookie to expire at the exact Date set by the backend JWT `exp`
    if (decoded.exp) {
      const expiresAt = new Date(decoded.exp * 1000);
      Cookies.set(ACCESS_TOKEN_KEY, token, { expires: expiresAt, path: "/" });
    } else {
      // Fallback if no exp claim is present
      Cookies.set(ACCESS_TOKEN_KEY, token, { path: "/" });
    }
  } catch {
    Cookies.set(ACCESS_TOKEN_KEY, token, { path: "/" });
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);

  // Start the background countdown timer based on backend exp
  scheduleTokenExpiryLogout(token);
};

export const clearAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const isAdminAuthenticated = () => {
  const token = getAccessToken();
  const valid = isTokenValid(token);

  if (!valid) {
    clearAccessToken();
    clearUserDetailsInLocalStorage();
    return false;
  }

  return true;
};

// Initialize background timer on page refresh
const existingToken = getAccessToken();
if (existingToken && isTokenValid(existingToken)) {
  scheduleTokenExpiryLogout(existingToken);
}