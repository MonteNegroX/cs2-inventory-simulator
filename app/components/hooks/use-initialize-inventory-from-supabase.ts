// src/components/hooks/use-initialize-inventory-from-supabase.ts
import { useEffect, useRef } from "react";
import { supabase } from "~/db/supabase";
import { CS2Inventory } from "@ianlucas/cs2-lib";
import { useInventory } from "../app-context";

export function useInitializeInventoryFromSupabase(userId?: number) {
  const hasLoaded = useRef(false);
  const [_, setInventory] = useInventory();

  useEffect(() => {
    if (!userId || hasLoaded.current) return;

    const loadInventory = async () => {
      console.log("📦 Загрузка инвентаря из Supabase для пользователя", userId);

      const { data, error } = await supabase
        .from("inventory")
        .select("item")
        .eq("user_id", userId);

      if (error) {
        console.error("❌ Ошибка Supabase:", error);
        return;
      }

      const inventory = new CS2Inventory();

      if (data) {
        for (const row of data) {
          try {
            inventory.add(row.item); // Добавление предмета
          } catch (e) {
            console.warn("⚠️ Ошибка при добавлении предмета:", row.item, e);
          }
        }
      }

      setInventory(inventory);
      hasLoaded.current = true;
      console.log("✅ Инвентарь загружен. Предметов:", inventory.items.length);
    };

    loadInventory();
  }, [userId]);
}
