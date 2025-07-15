import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TelegramUser } from "~/contexts/TelegramAuthContext";
import { supabase } from "~/db/supabase";
import { Loader2 } from "lucide-react";

interface ProfilePopupProps {
  user: TelegramUser;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({
  user,
  onClose,
  onLogout,
}) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [xpToday, setXpToday] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: player } = await supabase
        .from("players")
        .select("balance, avatar_url")
        .eq("user_id", user.id)
        .single();

      if (player) {
        setBalance(player.balance ?? 0);
        setAvatarUrl(player.avatar_url ?? null);
      }

      const todayStartUTC = new Date();
      todayStartUTC.setUTCHours(0, 0, 0, 0);
      const isoDate = todayStartUTC.toISOString();

      const { data: xpRows } = await supabase
        .from("xp_history")
        .select("xp_amount")
        .eq("user_id", user.id)
        .gte("created_at", isoDate);

      const totalXp = xpRows?.reduce((sum, row) => sum + (row.xp_amount ?? 0), 0) ?? 0;
      setXpToday(totalXp);

      setLoading(false);
    };

    fetchData();
  }, [user.id]);

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1f1f1f] text-white rounded-2xl p-6 w-[320px] shadow-2xl border border-neutral-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-2">
          <img
            src={avatarUrl || user.photo_url}
            alt="avatar"
            className="w-20 h-20 rounded-full border-2 border-white shadow-md"
          />
          <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
          {user.username && (
            <p className="text-gray-400 text-sm">@{user.username}</p>
          )}
          <p className="text-xs text-gray-500">ID: {user.id}</p>

          <div className="mt-4 w-full flex flex-col gap-2 text-sm">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-300">💰 Баланс:</span>
                  <span className="text-white font-medium">{balance?.toFixed(2)} TON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">⚡ XP за сегодня:</span>
                  <span className="text-white font-medium">{xpToday}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
