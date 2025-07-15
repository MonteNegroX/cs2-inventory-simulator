// app/components/unlock-case.tsx 
import { CS2Economy, CS2UnlockedItem } from "@ianlucas/cs2-lib";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  useInventoryItem,
  useTryInventoryItem
} from "~/components/hooks/use-inventory-item";
import { useTimer } from "~/components/hooks/use-timer";
import { unlockNonSpecialItem } from "~/utils/economy";
import { range } from "~/utils/number";
import { playSound } from "~/utils/sound";
import { useInventory, useAppContext } from "./app-context";
import { useKeyRelease } from "./hooks/use-key-release";
import { useIsSyncing } from "./hooks/use-sync-state";
import { Overlay } from "./overlay";
import { UnlockCaseContainer } from "./unlock-case-container";
import { UnlockCaseContainerUnlocked } from "./unlock-case-container-unlocked";
import { applyCustomOverrides } from "~/utils/custom-overrides";
import { useTelegramAuth } from "~/contexts/TelegramAuthContext";
import { supabase } from "~/db/supabase";
import { logCaseOpening } from "~/utils/logCaseOpening";
import { getCasePrice } from "~/constants/case-prices";


export function UnlockCase({
  caseUid,
  keyUid,
  onClose
}: {
  caseUid: number;
  keyUid?: number;
  onClose: () => void;
}) {
  const debug = true;
  const { env } = useAppContext();
  const OPEN_CASE_MODE = env.OPEN_CASE_MODE ?? "CLASSIC";
  const { user } = useTelegramAuth();

  const isSyncing = useIsSyncing();
  const [inventory, setInventory] = useInventory();
  const [items, setItems] = useState<CS2UnlockedItem[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [canUnlock, setCanUnlock] = useState(true);
  const [unlockedItem, setUnlockedItem] = useState<CS2UnlockedItem>();
  const [hideCaseContents, setHideCaseContents] = useState(false);
  const unlockedItemRef = useRef<CS2UnlockedItem>();
  const wait = useTimer();

  const caseItem = useInventoryItem(caseUid);
  const neededKeyItem =
    caseItem.keys !== undefined ? CS2Economy.getById(caseItem.keys[0]) : undefined;
  const keyItem = useTryInventoryItem(keyUid);

  async function addUnlockedItemToInventory() {
    console.log("🟢 [addUnlockedItemToInventory] called");

    if (!user?.id) {
      console.error("❌ user.id missing, skipping Supabase save.");
      return;
    }

    const unlocked = unlockedItemRef.current;
    if (!unlocked) {
      console.error("❌ unlockedItemRef empty.");
      return;
    }

    const containerItemBefore = inventory.get(caseUid);
    if (!containerItemBefore) {
      console.error("❌ Container not found in inventory.");
      return;
    }

    try {
      const econItem = CS2Economy.getById(unlocked.id);
      const overriddenItem = applyCustomOverrides({ ...econItem });

      const updatedInventory = inventory.unlockContainer(unlocked, caseUid, undefined);
      updatedInventory.add({ id: containerItemBefore.id });
      setInventory(updatedInventory);
      console.log("✅ Inventory updated locally.");

      const itemForDb = {
        id: unlocked.id,
        name: overriddenItem.name,
        type: overriddenItem.type,
        rarity: overriddenItem.rarity,
        price: overriddenItem.price,
        image: overriddenItem.image,
        color: overriddenItem.color,
        exterior: overriddenItem.exterior,
        quality: overriddenItem.quality,
        category: overriddenItem.category,
        ...unlocked.attributes
      };

      console.log("📦 Calling Supabase RPC add_item_to_inventory with:", {
        user_id: user.id,
        item: itemForDb
      });

      const { error } = await supabase.from("inventory").insert([
        {
          user_id: user.id,
          item: itemForDb
        }
      ]);

      const case_id = caseItem.id;

      await logCaseOpening({
        user_id: user.id,
        case_name: caseItem.name,
        case_id,
        item: itemForDb
      });

      if (error) {
        console.error("❌ Supabase RPC error:", error);
      } else {
        console.log("✅ Saved to Supabase inventory JSONB via RPC.");
      }
    } catch (e) {
      console.error("❌ Failed to send to Supabase:", e);
    }

    setUnlockedItem(unlocked);
    unlockedItemRef.current = undefined;
    console.log("🔚 [addUnlockedItemToInventory] complete");
  }

  function handleClose() {
    addUnlockedItemToInventory();
    onClose();
  }

  async function handleUnlockClassic() {
    console.log("🎉 [handleUnlockClassic] Starting case opening...");

    setIsDisplaying(false);
    setCanUnlock(false);

    const unlocked = caseItem.unlockContainer();
    unlockedItemRef.current = unlocked;

    wait(() => {
      setHideCaseContents(true);
      if (caseItem.keys !== undefined) playSound("case_unlock");

      wait(() => {
        setItems(
          range(32).map((_, i) =>
            i === 28 ? unlocked : unlockNonSpecialItem(caseItem)
          )
        );
        setIsDisplaying(true);

        wait(addUnlockedItemToInventory, 6000);
      }, 100);
    }, 250);
  }

  async function handleUnlockSimulation() {
    const openCount = 10000;
    const results: Record<number, number> = {};
    let totalValue = 0;

    for (let i = 0; i < openCount; i++) {
      const unlocked = caseItem.unlockContainer();
      results[unlocked.id] = (results[unlocked.id] || 0) + 1;
      const econItem = CS2Economy.getById(unlocked.id);
      const overridden = applyCustomOverrides({ ...econItem });
      totalValue += overridden.price || 0;
    }

    const spent = openCount * (caseItem.price ?? 2);
    const houseEdge = ((1 - totalValue / spent) * 100).toFixed(2);

    console.log("🔹 10k open simulation results:", results);
    console.log(`💰 Spent: ${spent} TON`);
    console.log(`💎 Earned: ${totalValue.toFixed(2)} TON`);
    console.log(`🏠 House Edge: ${houseEdge}%`);
    alert("✅ Simulation complete, check console.");
  }

  const handleUnlock =
    OPEN_CASE_MODE === "SIMULATION" ? handleUnlockSimulation : handleUnlockClassic;

  useKeyRelease("Escape", handleClose);

  if (typeof document === "undefined") return null;

  return createPortal(
    <Overlay isWrapperless>
      {unlockedItem ? (
        <UnlockCaseContainerUnlocked
          caseItem={caseItem}
          onClose={onClose}
          unlockedItem={unlockedItem}
        />
      ) : (
        <UnlockCaseContainer
          canUnlock={canUnlock}
          caseItem={caseItem}
          caseUid={caseUid}
          hideCaseContents={hideCaseContents}
          isDisplaying={isDisplaying}
          isSyncing={isSyncing}
          items={items}
          keyItem={keyItem}
          neededKeyItem={neededKeyItem}
          onClose={handleClose}
          onUnlock={handleUnlock}
        />
      )}
    </Overlay>,
    document.body
  );
}
