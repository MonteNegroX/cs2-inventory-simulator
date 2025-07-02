// app/routes/api.open-case.ts

import { supabaseServer } from "~/db/supabaseServer";
import { CS2Economy } from "@ianlucas/cs2-lib";

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    const { user_id, case_id } = body;

    if (!user_id || !case_id) {
      return new Response(JSON.stringify({ error: "Missing user_id or case_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1️⃣ Загружаем игрока
    const { data: player, error: playerError } = await supabaseServer
      .from("players")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (playerError || !player) {
      console.error("❌ Player not found:", playerError);
      return new Response(JSON.stringify({ error: "Player not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2️⃣ Получаем кейс из CS2Economy
    const caseItem = CS2Economy.getById(case_id);
    if (!caseItem) {
      return new Response(JSON.stringify({ error: "Case not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const casePrice = caseItem.price ?? 2; // TON

    if (player.balance < casePrice) {
      return new Response(JSON.stringify({ error: "Insufficient balance" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3️⃣ Открываем кейс
    const unlockedItem = caseItem.unlockContainer();
    const econItem = CS2Economy.getById(unlockedItem.id);

    const droppedPrice = econItem.price ?? 0;
    const newBalance = player.balance - casePrice;
    const newNetLoss = (player.net_loss ?? 0) + (casePrice - droppedPrice);

    // 4️⃣ Обновляем игрока
    const updatedInventory = [...(player.inventory ?? []), {
      id: econItem.id,
      name: econItem.name,
      rarity: econItem.rarity,
      price: droppedPrice,
      image_url: econItem.image ?? ""
    }];

    const { error: updateError } = await supabaseServer
      .from("players")
      .update({
        balance: newBalance,
        net_loss: newNetLoss,
        inventory: updatedInventory,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id);

    if (updateError) {
      console.error("❌ Error updating player after case open:", updateError);
      return new Response(JSON.stringify({ error: "Failed to update player" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`✅ ${user_id} opened case, got ${econItem.name}, balance now ${newBalance}, net_loss now ${newNetLoss}`);

    return new Response(JSON.stringify({
      item: {
        id: econItem.id,
        name: econItem.name,
        rarity: econItem.rarity,
        price: droppedPrice,
        image_url: econItem.image ?? ""
      },
      new_balance: newBalance,
      new_net_loss: newNetLoss
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error in open-case:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
