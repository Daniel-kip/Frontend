import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { formatUTCDateTime } from "../utils/dateUtils";

const AuthContext = createContext(null);

/** Safely decode a JWT payload */
function parseJwtPayload(jwt) {
  if (!jwt) return null;
  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob === "function"
        ? decodeURIComponent(
            Array.prototype.map
              .call(atob(b64), (c) =>
                "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
              )
              .join("")
          )
        : Buffer.from(b64, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Local token helpers */
const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const clearAccessToken = () => {
  localStorage.removeItem("accessToken");
  delete api.defaults.headers.common["Authorization"];
};

/** Main AuthProvider */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("accessToken") || null);

  /** Update last login timestamp */
  const updateLastLoginTime = useCallback(() => {
    if (user) {
      const updated = { ...user, lastLoginTime: formatUTCDateTime() };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    }
  }, [user]);

  /** Logout user */
  const logout = useCallback(async () => {
    try {
      await api.post("/Auth/logout", {}, { withCredentials: true }).catch(() => {});
    } finally {
      clearAccessToken();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    }
  }, []);

  /** Extract expiry from JWT */
  const getExpiryFromToken = useCallback((jwt) => {
    const payload = parseJwtPayload(jwt);
    return payload?.exp ? payload.exp * 1000 : null;
  }, []);

  /** Apply new access token */
  const applyAccessToken = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      setAccessToken(newToken);
      setIsAuthenticated(true);
    } else {
      clearAccessToken();
      setIsAuthenticated(false);
    }
  }, []);

  /** Attempt to refresh access token */
  const attemptRefresh = useCallback(async () => {
    try {
      const res = await api.post("/Auth/refresh-token", {}, { withCredentials: true });
      const newAccessToken = res?.data?.accessToken || res?.data?.token || null;
      const userFromResponse = res?.data?.user || null;

      if (newAccessToken) {
        applyAccessToken(newAccessToken);
        if (userFromResponse) {
          setUser(userFromResponse);
          localStorage.setItem("user", JSON.stringify(userFromResponse));
        }
        return true;
      }
    } catch {
      // Ignore failed refresh
    }
    return false;
  }, [applyAccessToken]);

  /** Validate or refresh authentication on startup */
  const checkAuthStatus = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      if (token) {
        const expiry = getExpiryFromToken(token);
        if (expiry && expiry > Date.now()) {
          setIsAuthenticated(true);
          return true;
        }
        clearAccessToken();
      }

      const refreshed = await attemptRefresh();
      if (!refreshed) {
        setIsAuthenticated(false);
        return false;
      }
      return true;
    } finally {
      setIsLoadingAuth(false);
    }
  }, [token, getExpiryFromToken, attemptRefresh]);

  /** Login with email and password */
  const loginWithCredentials = useCallback(
    async (email, password) => {
      try {
        const res = await api.post("/Auth/Login", { email, password }, { withCredentials: true });
        const token = res?.data?.accessToken || res?.data?.token;
        const userData = res?.data?.user;

        if (!token) {
          return { success: false, message: res?.data?.message || "No token returned" };
        }

        applyAccessToken(token);
        const finalUser = userData || { login: email, lastLoginTime: formatUTCDateTime() };
        setUser(finalUser);
        localStorage.setItem("user", JSON.stringify(finalUser));
        return { success: true };
      } catch (err) {
        return { success: false, message: err?.response?.data?.message || "Login failed" };
      }
    },
    [applyAccessToken]
  );

  /** Token expiry watcher */
  useEffect(() => {
    if (!token) return;
    const expiry = getExpiryFromToken(token);
    if (!expiry) {
      logout();
      return;
    }

    const timeout = expiry - Date.now();
    if (timeout <= 0) {
      (async () => {
        const refreshed = await attemptRefresh();
        if (!refreshed) logout();
      })();
      return;
    }

    const id = setTimeout(async () => {
      const refreshed = await attemptRefresh();
      if (!refreshed) logout();
    }, timeout);

    return () => clearTimeout(id);
  }, [token, attemptRefresh, logout, getExpiryFromToken]);

  /** Initial authentication check */
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingAuth,
        user,
        token,
        loginWithCredentials,
        logout,
        checkAuthStatus,
        updateLastLoginTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** Context hook */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;