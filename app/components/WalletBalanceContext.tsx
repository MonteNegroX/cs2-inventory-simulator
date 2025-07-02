// app/components/WalletBalanceContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTelegramAuth } from "~/contexts/TelegramAuthContext";

const WalletBalanceContext = createContext<{
  balance: number;
  deduct: (amount: number) => boolean;
  add: (amount: number) => void;
} | null>(null);

export const WalletBalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState(0);
  const { user } = useTelegramAuth();

  // ✅ Подгружаем баланс при загрузке
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/get-balance?user_id=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.balance === "number") {
            setBalance(data.balance);
          } else {
            console.warn("❌ Unexpected balance data:", data);
          }
        } else {
          console.error("❌ Failed to fetch balance:", await res.text());
        }
      } catch (e) {
        console.error("❌ Error fetching balance:", e);
      }
    };
    fetchBalance();
  }, [user?.id]);

  const syncBalanceToSupabase = async (newBalance: number) => {
    if (!user?.id) return;
    try {
      const res = await fetch("/api/update-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          amount: newBalance,
          overwrite: true, // используем overwrite
        }),
      });
      if (!res.ok) {
        console.error("❌ Failed to sync balance to Supabase:", await res.text());
      } else {
        console.log("✅ Synced balance to Supabase:", newBalance);
      }
    } catch (e) {
      console.error("❌ Error syncing balance:", e);
    }
  };

  const deduct = (amount: number) => {
    if (balance >= amount) {
      const newBalance = balance - amount;
      setBalance(newBalance);
      syncBalanceToSupabase(newBalance);
      return true;
    }
    return false;
  };

  const add = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    syncBalanceToSupabase(newBalance);
  };

  return (
    <WalletBalanceContext.Provider value={{ balance, deduct, add }}>
      {children}
    </WalletBalanceContext.Provider>
  );
};

export const useWalletBalance = () => {
  const ctx = useContext(WalletBalanceContext);
  if (!ctx) throw new Error("useWalletBalance must be used within WalletBalanceProvider");
  return ctx;
};
