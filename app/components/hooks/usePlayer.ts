import { useEffect, useState } from "react";
import { supabase } from "~/db/supabase";

export function usePlayer(userId: string) {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    async function fetchPlayer() {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        // Not found → create new
        const { data: newPlayer } = await supabase.from("players").insert({
          user_id: userId,
          inventory: [],
          balance: 0,
        }).select("*").single();
        setPlayer(newPlayer);
      } else {
        setPlayer(data);
      }
    }

    fetchPlayer();
  }, [userId]);

  const updatePlayer = async (updates) => {
    if (!player) return;
    const { data, error } = await supabase
      .from("players")
      .update({ ...updates, updated_at: new Date() })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (!error) {
      setPlayer(data);
    }
  };

  return { player, updatePlayer };
}
