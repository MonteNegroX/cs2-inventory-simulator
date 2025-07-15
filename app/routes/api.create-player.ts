// app/routes/api.create-player.ts
// todo реферальная система
import { supabaseAdmin } from "~/db/supabaseServer";

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
    // Проверяем, есть ли уже игрок
    const { data: existingPlayer, error: fetchError } = await supabaseAdmin
      .from("players")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("❌ Error checking player existence:", fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Если игрок существует, просто возвращаем его
    if (existingPlayer) {
      console.log("✅ Player already exists:", user_id);
      return new Response(JSON.stringify({ data: existingPlayer }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Если нет, создаем с дефолтными значениями
    const { data, error } = await supabaseAdmin
      .from("players")
      .insert(
        {
          user_id,
          username: username ?? null,
          inventory: [],
          balance: 0,
          net_loss: 0,
          avatar_url: `https://api.dicebear.com/9.x/adventurer/svg?seed=${user_id}&backgroundColor=b6e3f4,c0aede,d1d4f9` // 👈 добавлено
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
