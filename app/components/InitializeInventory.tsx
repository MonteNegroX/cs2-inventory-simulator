// components/InitializeInventory.tsx
import { useInitializeInventoryFromSupabase } from "~/components/hooks/use-initialize-inventory-from-supabase";
import { useTelegramAuth } from "~/contexts/TelegramAuthContext";

export function InitializeInventory() {
  const { user } = useTelegramAuth();
  useInitializeInventoryFromSupabase(user?.id);
  return null;
}