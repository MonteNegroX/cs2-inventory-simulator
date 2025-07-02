// app/components/hooks/useEnsurePlayerCreatedOnAuth.ts

import { useEffect } from "react";
import { TelegramUser } from "~/contexts/TelegramAuthContext";

export function useEnsurePlayerCreatedOnAuth(user: TelegramUser | null) {
  useEffect(() => {
    if (!user?.id) return;

    const createPlayer = async () => {
      try {
        const res = await fetch("/api/create-player", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            username: user.username ?? null
          })
        });

        if (!res.ok) {
          console.error("❌ Failed to create player:", await res.text());
        } else {
          console.log("✅ Player ensured in Supabase for:", user.id);
        }
      } catch (error) {
        console.error("❌ Error creating player:", error);
      }
    };

    createPlayer();
  }, [user]);
}
