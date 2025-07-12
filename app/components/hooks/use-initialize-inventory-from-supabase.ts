import { useEffect, useRef } from "react";
import { supabase } from "~/db/supabase";
import { CS2Inventory } from "@ianlucas/cs2-lib";
import { useInventory } from "../app-context";
import { getSanitizedCachedInventoryData } from "~/utils/inventory-cached-data";

export function useInitializeInventoryFromSupabase(userId?: number) {
  const hasLoaded = useRef(false);
  const [_, setInventory] = useInventory();

  useEffect(() => {
    if (!userId || hasLoaded.current) return;

    const loadInventory = async () => {
      console.log("📦 Загрузка инвентаря из Supabase + кеш", userId);

      const inventory = new CS2Inventory();

      // 1. Загружаем из Supabase
      const { data, error } = await supabase
        .from("inventory")
        .select("item")
        .eq("user_id", userId);

      if (error) {
        console.error("❌ Ошибка Supabase:", error);
      }

      if (data) {
        for (const row of data) {
          try {
            inventory.add(row.item);
          } catch (e) {
            console.warn("⚠️ Ошибка при добавлении предмета:", row.item, e);
          }
        }
      }

      // 2. Добавляем кешированные предметы
      const cached = getSanitizedCachedInventoryData();
      if (cached?.items) {
        for (const [uid, item] of Object.entries(cached.items)) {
          try {
            inventory.add(item);
          } catch (e) {
            console.warn("⚠️ Ошибка при добавлении кеш-предмета:", item, e);
          }
        }
        console.log("✅ Добавлено кеш-предметов:", Object.keys(cached.items).length);
      }

      setInventory(inventory);
      hasLoaded.current = true;
      console.log("✅ Инвентарь загружен. Всего предметов:", inventory.items.length);
    };

    loadInventory();
  }, [userId]);
}
