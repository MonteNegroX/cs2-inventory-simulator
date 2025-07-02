// app/contexts/TelegramAuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useEnsurePlayerCreatedOnAuth } from "../components/hooks/useEnsurePlayerCreatedOnAuth";

export interface TelegramUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
}

interface TelegramAuthContextType {
  user: TelegramUser | null;
  login: (userData: TelegramUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  authMethod: "seamless" | "widget" | "none";
}

const TelegramAuthContext = createContext<TelegramAuthContextType | undefined>(
  undefined
);

export const useTelegramAuth = () => {
  const context = useContext(TelegramAuthContext);
  if (!context)
    throw new Error("useTelegramAuth must be used within TelegramAuthProvider");
  return context;
};

export const TelegramAuthProvider = ({ children }: { children: ReactNode }) => {
  // ✅ СИНХРОННАЯ загрузка user из localStorage
  const initialUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("telegram_user") || "null")
      : null;

  const [user, setUser] = useState<TelegramUser | null>(initialUser);
  const [authMethod, setAuthMethod] = useState<"seamless" | "widget" | "none">(
    initialUser ? "widget" : "none"
  );

  useEnsurePlayerCreatedOnAuth(user); // ✅ Автосоздание игрока

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ Telegram WebApp detection
    if (window.Telegram?.WebApp) {
      const webapp = window.Telegram.WebApp;
      webapp.ready();
    }

    // ✅ Seamless auth from Telegram
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) {
      const userData: TelegramUser = {
        id: String(tgUser.id),
        first_name: tgUser.first_name,
        last_name: tgUser.last_name,
        username: tgUser.username,
        photo_url: tgUser.photo_url,
        auth_date: Math.floor(Date.now() / 1000),
        hash: window.Telegram.WebApp.initDataUnsafe.hash || "",
      };
      setUser(userData);
      setAuthMethod("seamless");
      localStorage.setItem("telegram_user", JSON.stringify(userData));
      return;
    }

    // ✅ Localhost fallback
    if (!initialUser && window.location.hostname === "localhost") {
      const userData: TelegramUser = {
        id: "fake_local_id",
        first_name: "Local",
        last_name: "Dev",
        username: "local_dev",
        photo_url:
          "https://api.dicebear.com/7.x/pixel-art/svg?seed=LocalDev",
        auth_date: Math.floor(Date.now() / 1000),
        hash: "localhash",
      };
      setUser(userData);
      setAuthMethod("widget");
      localStorage.setItem("telegram_user", JSON.stringify(userData));
      return;
    }
  }, []);

  const login = (userData: TelegramUser) => {
    setUser(userData);
    localStorage.setItem("telegram_user", JSON.stringify(userData));
    if (authMethod === "none") setAuthMethod("widget");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("telegram_user");
  };

  return (
    <TelegramAuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        authMethod,
      }}
    >
      {children}
    </TelegramAuthContext.Provider>
  );
};
