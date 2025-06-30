// app/components/WalletBalanceContext.tsx
import React, { createContext, useContext, useState } from 'react';

const WalletBalanceContext = createContext<{
  balance: number;
  deduct: (amount: number) => boolean;
  add: (amount: number) => void;
} | null>(null);

export const WalletBalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState(10);

  const deduct = (amount: number) => {
    if (balance >= amount) {
      setBalance((b) => b - amount);
      return true;
    }
    return false;
  };

  const add = (amount: number) => {
    setBalance((b) => b + amount);
  };

  return (
    <WalletBalanceContext.Provider value={{ balance, deduct, add }}>
      {children}
    </WalletBalanceContext.Provider>
  );
};

export const  useWalletBalance = () => {
  const ctx = useContext(WalletBalanceContext);
  if (!ctx) throw new Error("useWalletBalance must be used within WalletBalanceProvider");
  return ctx;
};
