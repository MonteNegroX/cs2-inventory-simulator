import { json } from "@remix-run/node";
import { supabaseServer } from "~/db/supabaseServer";

export const loader = async () => {
  const { data, error } = await supabaseServer
    .from("players")
    .select("user_id, username, net_loss")
    .order("net_loss", { ascending: false })
    .limit(50);

  if (error) {
    console.error("❌ Error loading leaderboard:", error);
    return json({ error: error.message }, { status: 500 });
  }

  const leaderboard = data.map(player => ({
    user_id: player.user_id,
    username: player.username,
    net_loss: Number(player.net_loss),
    leaderboard_score: Math.floor(Number(player.net_loss) * 100),
  }));

  return json({ leaderboard });
};
