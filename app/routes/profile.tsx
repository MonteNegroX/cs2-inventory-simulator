import React from "react";
import { useWalletBalance } from "~/components/WalletBalanceContext";

export default function ProfilePage() {
  const { balance, add } = useWalletBalance();

  const handleAddFunds = () => {
    add(5); // +5 TON для теста
  };

  const handleResetFunds = () => {
    add(-balance); // сброс до 0
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-white">
      <h1 className="text-2xl font-bold">👤 Профиль</h1>

      <div className="text-lg">
        Ваш баланс: <span className="font-mono">{balance.toFixed(2)} TON</span>
      </div>

      <button
        onClick={handleAddFunds}
        className="rounded bg-green-600 px-4 py-2 font-bold transition hover:bg-green-500"
      >
        Пополнить +5 TON
      </button>

      <button
        onClick={handleResetFunds}
        className="rounded bg-red-600 px-4 py-2 font-bold transition hover:bg-red-500"
      >
        Сбросить баланс
      </button>
    </div>
  );
}
