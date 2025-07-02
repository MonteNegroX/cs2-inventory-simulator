// app/routes/api.create-player.ts

import { supabaseServer } from "~/db/supabaseServer";

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    const { user_id, username } = body;

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabaseServer
      .from("players")
      .upsert(
        {
          user_id,
          username: username ?? null,
          inventory: [],
          balance: 0,
          net_loss: 0
        },
        { onConflict: "user_id" }
      )
      .select("*")
      .single();

    if (error) {
      console.error("❌ Supabase error creating player:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ Player created or ensured for:", user_id);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in create-player action:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
