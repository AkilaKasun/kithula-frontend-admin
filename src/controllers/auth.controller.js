import axios from "axios";
import ApiClient from "../helpers/ApiClient"; // Use ApiClient with Bearer headers
import { saveAccessToken, clearAccessToken, getAccessToken } from "../helpers/AuthStatus";
import { saveUserDetailsInLocalStorage, clearUserDetailsInLocalStorage } from "../helpers/userDetails";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

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

    if (data?.error) {
      throw new Error(data.error);
    }

    const token = data?.access_token;
    const user = data?.user;

    if (token) {
      saveAccessToken(token); // Saves cookie & localStorage with 60-min limit
      if (user) {
        saveUserDetailsInLocalStorage(user);
      }
    } else {
      throw new Error("No access token received from server.");
    }

    return data;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.detail ||
      error?.message ||
      "Invalid credentials.";
  }
}

/**
 * Enhanced SignOut calling FastAPI /logout route
 */
export async function signOut() {
  try {
    // 1. Call FastAPI Backend to set db_user.is_active = False
    await ApiClient.post("/logout");
  } catch (error) {
    console.warn("Backend logout notification failed or token expired:", error);
  } finally {
    // 2. Always clear local frontend session state
    clearAccessToken();
    clearUserDetailsInLocalStorage();
  }
}