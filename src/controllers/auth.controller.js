import axios from "axios";
import { saveAccessToken, clearAccessToken } from "../helpers/AuthStatus";
import { saveUserDetailsInLocalStorage, clearUserDetailsInLocalStorage } from "../helpers/userDetails";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function signIn(username, password) {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post(`${API_BASE_URL}/login`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = response.data;

    // Handle custom ErrorResponseModel returned from backend
    if (data?.error) {
      throw new Error(data.error);
    }

    const token = data?.access_token;
    const user = data?.user;

    if (token) {
      saveAccessToken(token); // Saves to cookie & localStorage
      if (user) {
        saveUserDetailsInLocalStorage(user);
      }
    } else {
      throw new Error("No access token received from server.");
    }

    return data;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error?.response?.data?.error || error?.response?.data?.detail || error.message || error;
  }
}

export function signOut() {
  clearAccessToken();
  clearUserDetailsInLocalStorage();
}