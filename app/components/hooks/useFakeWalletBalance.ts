// app/hooks/useFakeWalletBalance.ts
import { useState } from 'react';

export function useFakeWalletBalance(initial = 10) {
  const [balance, setBalance] = useState(initial);

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

  return { balance, deduct, add };
}
