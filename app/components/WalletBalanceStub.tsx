// app/components/WalletBalanceStub.tsx
import React from 'react';

export function WalletBalanceStub() {
  const fakeBalance = 12.345; // можно поменять на любое число

  return (
    <div className="text-xs text-white px-2 py-1 bg-stone-700 rounded ml-2">
      Balance: {fakeBalance.toFixed(2)} TON
    </div>
  );
}
