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

export function UnlockCase({
  caseUid,
  keyUid,
  onClose
}: {
  caseUid: number;
  keyUid?: number;
  onClose: () => void;
}) {
  const { env } = useAppContext();
  const OPEN_CASE_MODE = env.OPEN_CASE_MODE ?? "CLASSIC";
  const isSyncing = useIsSyncing();
  const [inventory, setInventory] = useInventory();
  const [items, setItems] = useState<CS2UnlockedItem[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [canUnlock, setCanUnlock] = useState(true);
  const [unlockedItem, setUnlockedItem] = useState<CS2UnlockedItem>();
  const [hideCaseContents, setHideCaseContents] = useState(false);
  const unlockedItemRef = useRef<CS2UnlockedItem>(undefined);

  const { user } = useTelegramAuth(); // ✅ Исправлено

  if (!user?.id) {
    return <div>Loading user...</div>;
  }

  const userId = user.id; // ✅

  const caseItem = useInventoryItem(caseUid);
  const neededKeyItem =
    caseItem.keys !== undefined ? CS2Economy.getById(caseItem.keys[0]) : undefined;
  const keyItem = useTryInventoryItem(keyUid);
  const wait = useTimer();

  function addUnlockedItemToInventory() {
    const unlockedItem = unlockedItemRef.current;
    if (!unlockedItem) {
      console.warn("⚠️ unlockedItem пуст, выход");
      return;
    }

    try {
      const updatedInventory = inventory.unlockContainer(
        unlockedItem,
        caseUid,
        undefined
      );
      updatedInventory.add({ id: caseUid });
      setInventory(updatedInventory);
      console.log("✅ Инвентарь обновлён локально для UI");
    } catch (e) {
      console.error("❌ Ошибка при локальном обновлении инвентаря:", e);
    }

    setUnlockedItem(unlockedItem);
    unlockedItemRef.current = undefined;
  }

  function handleClose() {
    addUnlockedItemToInventory();
    onClose();
  }

  async function handleUnlockClassic() {
    try {
      setIsDisplaying(false);
      setCanUnlock(false);

      const res = await fetch("/api/open-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          case_id: caseUid
        }),
      });

      if (!res.ok) {
        console.error("❌ Failed to open case:", await res.text());
        onClose();
        return;
      }

      const data = await res.json();
      console.log("✅ Case opened:", data);

      const unlockedItem = {
        id: data.item.id,
        name: data.item.name,
        rarity: data.item.rarity,
        price: data.item.price,
        image: data.item.image_url
      };

      unlockedItemRef.current = unlockedItem;

      wait(() => {
        setHideCaseContents(true);
        if (caseItem.keys !== undefined) playSound("case_unlock");
        wait(() => {
          setItems(
            range(32).map((_, i) =>
              i === 28 ? unlockedItem : unlockNonSpecialItem(caseItem)
            )
          );
          setIsDisplaying(true);
          wait(addUnlockedItemToInventory, 6000);
        }, 100);
      }, 250);
    } catch (e) {
      console.error("Unlock error:", e);
      onClose();
    }
  }

  async function handleUnlockSimulation() {
    // оставляем без изменений
  }

  const handleUnlock =
    OPEN_CASE_MODE === "SIMULATION" ? handleUnlockSimulation : handleUnlockClassic;

  useKeyRelease("Escape", handleClose);

  if (typeof document === "undefined") {
    return null;
  }

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
