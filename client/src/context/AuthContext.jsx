import { createContext, useContext, useMemo, useState } from "react";
import { clearFollowStateCache } from "../hooks/useFollowState";

const AuthContext = createContext(null);

// ✅ Safe JSON parser (avoids crash if data is undefined or invalid)
function safeJSONParse(value, fallback) {
  try {
    if (!value || value === "undefined" || value === "null") return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  // Token state
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // ✅ Safe user parse
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return safeJSONParse(raw, null);
  });

  // ✅ Safe accounts parse
  const [accounts, setAccounts] = useState(() => {
    const raw = localStorage.getItem("accounts");
    return safeJSONParse(raw, []);
  });

  // ✅ Login handler
  const login = (t, u) => {
    // Ensure consistent user object structure
    const normalizedUser = {
      ...u,
      id: u.id || u._id,
      _id: u._id || u.id,
      name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
    };
    
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setToken(t);
    setUser(normalizedUser);

    // Update or add to accounts
    const existingAccounts = safeJSONParse(localStorage.getItem("accounts"), []);
    const accountIndex = existingAccounts.findIndex(
      (acc) => acc.user._id === normalizedUser._id || acc.user.id === normalizedUser.id
    );

    const newAccount = { token: t, user: normalizedUser, addedAt: new Date().toISOString() };

    if (accountIndex === -1) {
      // Add new account
      const updated = [...existingAccounts, newAccount];
      localStorage.setItem("accounts", JSON.stringify(updated));
      setAccounts(updated);
    } else {
      // Update existing account
      const updated = [...existingAccounts];
      updated[accountIndex] = { ...updated[accountIndex], ...newAccount };
      localStorage.setItem("accounts", JSON.stringify(updated));
      setAccounts(updated);
    }
  };

  // ✅ Switch account handler
  const switchAccount = (account) => {
    localStorage.setItem("token", account.token);
    localStorage.setItem("user", JSON.stringify(account.user));
    setToken(account.token);
    setUser(account.user);
  };

  // ✅ Remove account
  const removeAccount = (accountId) => {
    const updated = accounts.filter(
      (acc) => acc.user._id !== accountId && acc.user.id !== accountId
    );
    localStorage.setItem("accounts", JSON.stringify(updated));
    setAccounts(updated);

    // Logout if removing current user
    if (user && (user._id === accountId || user.id === accountId)) {
      logout();
    }
  };

  // ✅ Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    clearFollowStateCache();
  };

  // ✅ Memoized context value
  const value = useMemo(
    () => ({
      token,
      user,
      accounts,
      login,
      logout,
      switchAccount,
      removeAccount,
    }),
    [token, user, accounts]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ Hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
