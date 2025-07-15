import { useEffect, useState } from "react";
import { supabase } from "~/db/supabase";

type TopEntry = {
  user_id: string;
  xp: number;
};

type PlayerProfile = {
  nickname: string;
  avatar_url: string;
};

export default function TopPlayers() {
  const [top, setTop] = useState<(TopEntry & PlayerProfile)[]>([]);

  useEffect(() => {
    async function fetchTop() {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data: xpData, error } = await supabase
        .from("xp_history")
        .select("user_id, xp_amount")
        .gte("created_at", since);

      if (error || !xpData) {
        console.error("❌ Failed to fetch XP:", error);
        return;
      }

      const xpMap: Record<string, number> = {};
      xpData.forEach(({ user_id, xp_amount }) => {
        xpMap[user_id] = (xpMap[user_id] || 0) + xp_amount;
      });

      const sorted = Object.entries(xpMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      const userIds = sorted.map(([id]) => id);

      const { data: profiles, error: profileErr } = await supabase
        .from("players")
        .select("user_id, username, avatar_url")
        .in("user_id", userIds);

      if (profileErr || !profiles) {
        console.error("❌ Failed to fetch profiles:", profileErr);
        return;
      }

      const profileMap = Object.fromEntries(
        profiles.map((p) => [p.user_id, p])
      );

      const fullData = sorted.map(([user_id, xp]) => ({
        user_id,
        xp,
        nickname: maskNickname(profileMap[user_id]?.username ?? "Unknown"),
        avatar_url: profileMap[user_id]?.avatar_url ?? "https://api.dicebear.com/9.x/adventurer/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9"
      }));

      setTop(fullData);
    }

    fetchTop();
  }, []);

  return (
    <div className="relative w-full max-w-md p-4 text-white">
      {/* TODO 🔘 Кнопка закрытия (только в браузере) */}
      <h2 className="text-center text-xl font-bold mb-6">🏆 ТОП игроков за сутки</h2>

      <div className="space-y-2">
        {top.map((user, idx) => (
          <div
            key={user.user_id}
            className={`flex items-center justify-between rounded-xl px-3 py-2 ${
              idx === 0
                ? "bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900"
                : "bg-zinc-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar_url}
                className="h-10 w-10 rounded-full border border-white"
                alt="avatar"
              />
              <div>
                <div className="text-sm font-medium">{user.nickname}</div>
                <div className="text-xs text-gray-400">
                  Opened XX cases {/* TODO: подгрузить из case_openings */}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-400 font-semibold">{user.xp} XP</div>
              <div className="text-xs text-gray-400">#{idx + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// маскируем никнейм как на скрине
function maskNickname(nickname: string): string {
  if (nickname.length <= 4) return nickname;
  return nickname.slice(0, 2) + "*".repeat(nickname.length - 4) + nickname.slice(-2);
}
