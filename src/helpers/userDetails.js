const KEY = "kithula_admin_user";

export function saveUserDetailsInLocalStorage(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUserDetailsInLocalStorage() {
  const userStr = localStorage.getItem(KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function clearUserDetailsInLocalStorage() {
  localStorage.removeItem(KEY);
}