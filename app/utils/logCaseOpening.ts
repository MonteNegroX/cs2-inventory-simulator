// app/utils/logCaseOpening.ts
import { supabase} from "~/db/supabase";

type LogCaseOpeningParams = {
  user_id: number;
  case_id: string;
  case_price: number;
  item: any; // структура такая же, как в inventory
};

// 👇 добавим вспомогательную функцию обновления net_loss
async function updateNetLoss(user_id: number) {
  const { data, error } = await supabase
    .from("case_openings")
    .select("case_price, item_value")
    .eq("user_id", user_id);

  if (error || !data) {
    console.error("❌ Failed to fetch case_openings:", error);
    return;
  }

  const totalSpent = data.reduce((sum, row) => sum + (row.case_price || 0), 0);
  const totalValue = data.reduce((sum, row) => sum + (row.item_value || 0), 0);
  const netLoss = totalSpent - totalValue;

  const { error: updateError } = await supabase
    .from("players")
    .update({net_loss: netLoss })
    .eq("user_id", user_id);

  if (updateError) {
    console.error("❌ Failed to update net_loss:", updateError);
  } else {
    console.log("📉 net_loss updated:", netLoss);
  }
}

export async function logCaseOpening({
  user_id,
  case_id,
  case_price,
  item
}: LogCaseOpeningParams) {
  const { error } = await supabase.from("case_openings").insert([
    {
      user_id,
      case_id,
      case_price,
      item,
      opened_at: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error("❌ Failed to log case opening:", error);
  } else {
    console.log("📦 Logged case opening for user:", user_id);
    await updateNetLoss(user_id);
  }
}

