// app/components/UnlockContainerButton.tsx
import React, { useState } from 'react';
import { useFakeWalletBalance } from './hooks/useFakeWalletBalance';

export function UnlockContainerButton() {
  const { balance, deduct } = useFakeWalletBalance();
  const [status, setStatus] = useState('');

  const handleUnlock = () => {
    const price = 2; // стоимость открытия контейнера

    if (deduct(price)) {
      setStatus(`✅ Unlocked for ${price} TON!`);
      // Тут может быть логика: openAnimation(), dispatchAppEvent(), etc.
    } else {
      setStatus('❌ Not enough TON to unlock!');
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleUnlock}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Unlock Container (2 TON)
      </button>
      <span className="text-white text-sm">Balance: {balance.toFixed(2)} TON</span>
      {status && <span className="text-xs text-yellow-400">{status}</span>}
    </div>
  );
}
