// app/routes/api.update-balance.ts

import { supabaseAdmin } from "~/db/supabaseServer";

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    const { user_id, amount } = body;

    // 💡 Добавляем логи для дебага
    console.log("📦 update-balance received:", { user_id, amount });

    // Приведение к числу для безопасной проверки
    const parsedAmount = Number(amount);

    if (!user_id || isNaN(parsedAmount)) {
      console.error("❌ Invalid request payload:", { user_id, amount });
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Получаем текущий баланс
    const { data: player, error: fetchError } = await supabaseAdmin
      .from("players")
      .select("balance")
      .eq("user_id", user_id)
      .single();

    if (fetchError || !player) {
      console.error("❌ Player not found:", fetchError);
      return new Response(JSON.stringify({ error: "Player not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newBalance = player.balance + parsedAmount;

    // Обновляем баланс
    const { data, error } = await supabaseAdmin
      .from("players")
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id)
      .select("*")
      .single();

    if (error) {
      console.error("❌ Supabase update error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`✅ Balance updated for ${user_id}: ${newBalance}`);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Internal error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
