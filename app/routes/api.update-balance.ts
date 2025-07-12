// app/routes/api.update-balance.ts

import { supabaseAdmin } from "~/db/supabaseServer";

export const action = async ({ request }) => {
  const body = await request.json();
  const { user_id, amount, overwrite } = body;

  console.log("📦 updateBalance received:", body);
  console.trace("📍 Trace for update-balance");

  if (!user_id || typeof amount !== "number") {
    return new Response(JSON.stringify({ error: "Missing or invalid user_id/amount" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (overwrite) {
      const { error } = await supabaseAdmin
        .from("players")
        .update({ balance: amount })
        .eq("user_id", user_id);

      if (error) throw error;

      console.log(`✅ Balance overwritten for ${user_id}: ${amount}`);
    } else {
      const { data: current, error: fetchError } = await supabaseAdmin
        .from("players")
        .select("balance")
        .eq("user_id", user_id)
        .single();

      if (fetchError) throw fetchError;

      const newBalance = Number(current.balance) + amount;

      const { error: updateError } = await supabaseAdmin
        .from("players")
        .update({ balance: newBalance })
        .eq("user_id", user_id);

      if (updateError) throw updateError;

      console.log(`✅ Balance incremented for ${user_id}: +${amount} → ${newBalance}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("❌ Supabase balance update failed:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
