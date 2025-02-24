import { createContext, useContext, useState, useEffect } from "react";
import api from "../../utilities/api.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //  Restore token from localStorage on page refresh
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }

    // Check if refresh token exists in cookies
    const hasRefreshToken = document.cookie.includes("refreshToken");
    if (hasRefreshToken) {
      api.refreshAccessToken(setAccessToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function login(email, password) {
    try {
      const success = await api.login(email, password);
      if (success) {
        setAccessToken(success.accessToken);
        localStorage.setItem("accessToken", success.accessToken); //  Store in localStorage
      }
      return success;
    } catch (error) {
      console.error("Login failed:", error.message);
      return false;
    }
  }

  async function logout() {
    await api.logout();
  }

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, login, logout }}
    >
      {!isLoading && children} {/*  Prevent rendering before checking auth */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
