import { type AuthProvider, HttpError } from "ra-core";
import { apiFetch, csrfFetch } from "../lib/http-client";

export const authProvider: AuthProvider = {
  async login({ username, password }) {
    const body = new URLSearchParams();

    body.set("username", username);
    body.set("password", password);

    const response = await csrfFetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      throw new HttpError(
        "Invalid username or password",
        response.status,
      );
    }
  },

  async checkAuth() {
    const response = await apiFetch("/api/auth/me");

    if (!response.ok) {
      throw new Error("Authentication required");
    }
  },

  async checkError(error) {
    if (error?.status === 401) {
      throw new Error("Session has expired");
    }

    if (error?.status === 403) {
      throw {
        logoutUser: false,
        redirectTo: "/access-denied",
        message: "Access denied",
      };
    }
  },

  async logout() {
    await csrfFetch("/api/auth/logout", {
      method: "POST",
    });
  },
};