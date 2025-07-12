// app/utils/logCaseOpening.ts
import { supabase} from "~/db/supabase";

type LogCaseOpeningParams = {
  user_id: number;
  case_id: string;
  case_price: number;
  item: any; // структура такая же, как в inventory
};

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
  }
}

