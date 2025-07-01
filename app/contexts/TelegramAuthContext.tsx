import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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

const TelegramAuthContext = createContext<TelegramAuthContextType | undefined>(undefined);

export const useTelegramAuth = () => {
  const context = useContext(TelegramAuthContext);
  if (!context) throw new Error("useTelegramAuth must be used within TelegramAuthProvider");
  return context;
};

export const TelegramAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [authMethod, setAuthMethod] = useState<"seamless" | "widget" | "none">("none");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ Telegram WebApp detection
    if (window.Telegram?.WebApp) {
      const webapp = window.Telegram.WebApp;
      webapp.ready();
      // Удаляем webapp.requestFullscreen();
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

    // ✅ Localhost fallback (заглушка)
    if (window.location.hostname === "localhost") {
      const userData: TelegramUser = {
        id: "fake_local_id",
        first_name: "Local",
        last_name: "Dev",
        username: "local_dev",
        photo_url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=LocalDev",
        auth_date: Math.floor(Date.now() / 1000),
        hash: "localhash",
      };
      setUser(userData);
      setAuthMethod("widget");
      localStorage.setItem("telegram_user", JSON.stringify(userData));
      return;
    }

    // ✅ Check for stored user in localStorage
    const storedUser = localStorage.getItem("telegram_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setAuthMethod("widget");
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("telegram_user");
      }
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
      value={{ user, login, logout, isAuthenticated: !!user, authMethod }}
    >
      {children}
    </TelegramAuthContext.Provider>
  );
};
