// app/routes/api.open-case.ts

import { supabaseAdmin } from "~/db/supabaseServer";

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("🪐 Received open-case request:", body);

    const { user_id, case_id } = body;

    if (!user_id || !case_id) {
      console.error("❌ Missing user_id or case_id:", { user_id, case_id });
      return new Response(JSON.stringify({ error: "Missing user_id or case_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Загружаем текущего игрока
    const { data: player, error: fetchError } = await supabaseAdmin
      .from("players")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (fetchError || !player) {
      console.error("❌ Error fetching player:", fetchError);
      return new Response(JSON.stringify({ error: fetchError?.message || "Player not found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Проверяем баланс
    const casePrice = 2; // можно динамически подгружать цену кейса
    if (player.balance < casePrice) {
      console.error(`❌ Insufficient balance: ${player.balance} < ${casePrice}`);
      return new Response(JSON.stringify({ error: "Insufficient balance" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Выбираем случайный предмет (заглушка)
    const item = {
      id: 123,
      name: "Test Item",
      rarity: "Rare",
      price: 1.5,
      image_url: "https://placehold.co/64",
      wear: 0.123 // ✅ Добавляем wear

    };

    // Обновляем баланс игрока
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("players")
      .update({
        balance: player.balance - casePrice,
        inventory: [...(player.inventory ?? []), item],
      })
      .eq("user_id", user_id)
      .select("*")
      .single();

    if (updateError) {
      console.error("❌ Error updating player after case open:", updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`✅ Case opened for user ${user_id}. New balance: ${updated.balance}`);

    return new Response(JSON.stringify({ item }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in open-case action:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
