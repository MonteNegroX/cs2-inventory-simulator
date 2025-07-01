// app/components/WalletBalanceStub.tsx
import React from 'react';
import { useWalletBalance } from './WalletBalanceContext';

export function WalletBalanceStub() {
  const { balance } = useWalletBalance();

  return (
    <div className="text-xs text-white px-2 py-1 bg-stone-700 rounded ml-2">
      Balance: {balance.toFixed(2)} TON
    </div>
  );
}
