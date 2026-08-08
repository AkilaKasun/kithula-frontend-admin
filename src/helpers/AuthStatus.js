import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "kithula_access_token";

export const getAccessToken = () => {
  // Checks Cookie first, falls back to localStorage
  return Cookies.get(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const saveAccessToken = (token) => {
  // Save in cookie and localStorage simultaneously
  Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 1, path: "/" });
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const isAdminAuthenticated = () => {
  return Boolean(getAccessToken());
};