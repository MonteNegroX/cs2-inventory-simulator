import { useEffect, useState } from "react";
import { supabase } from "~/db/supabase";

interface Player {
  id: string;
  user_id: string;
  inventory: any[];
  balance: number;
  created_at: string;
  updated_at: string;
}

export function usePlayer(userId: string) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPlayer = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        // Создаём нового игрока
        const { data: newPlayer, error: insertError } = await supabase
          .from("players")
          .insert({
            user_id: userId,
            inventory: [],
            balance: 0,
          })
          .select("*")
          .single();

        if (insertError) {
          console.error("Error creating player:", insertError);
        } else {
          setPlayer(newPlayer);
        }
      } else {
        setPlayer(data);
      }
      setLoading(false);
    };

    fetchPlayer();
  }, [userId]);

  const updatePlayer = async (updates: Partial<Player>) => {
    if (!player) return;

    const { data, error } = await supabase
      .from("players")
      .update({ ...updates })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (!error && data) {
      setPlayer(data);
    } else {
      console.error("Error updating player:", error);
    }
  };

  return { player, updatePlayer, loading };
}
