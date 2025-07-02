// app/routes/api.add-item.ts

import { supabaseAdmin } from "~/db/supabaseServer";

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("📥 [api.add-item] Received payload:", body);

    const { user_id, item_id } = body;

    if (!user_id || !item_id) {
      console.error("❌ Missing user_id or item_id in payload");
      return new Response(JSON.stringify({ error: "Missing user_id or item_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 👇 Добавляем item_id в массив inventory
    const { data, error } = await supabaseAdmin.rpc("add_item_to_inventory", {
      p_user_id: user_id,
      p_item_id: item_id,
    });

    if (error) {
      console.error("❌ Supabase RPC error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ Item added to inventory via RPC for user:", user_id);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("❌ Error in /api/add-item:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
