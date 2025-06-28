// src/components/unlock-case/unlock-case.tsx (финальная версия под Remix + AppProvider)

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
import { useInventory, useUser, useAppContext } from "./app-context";
import { useKeyRelease } from "./hooks/use-key-release";
import { useIsSyncing } from "./hooks/use-sync-state";
import { Overlay } from "./overlay";
import { UnlockCaseContainer } from "./unlock-case-container";
import { UnlockCaseContainerUnlocked } from "./unlock-case-container-unlocked";

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
  const user = useUser();
  const isSyncing = useIsSyncing();
  const [inventory, setInventory] = useInventory();
  const [items, setItems] = useState<CS2UnlockedItem[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [canUnlock, setCanUnlock] = useState(true);
  const [unlockedItem, setUnlockedItem] = useState<CS2UnlockedItem>();
  const [hideCaseContents, setHideCaseContents] = useState(false);
  const unlockedItemRef = useRef<CS2UnlockedItem>(undefined);

  const caseItem = useInventoryItem(caseUid);
  const neededKeyItem =
    caseItem.keys !== undefined ? CS2Economy.getById(caseItem.keys[0]) : undefined;
  const keyItem = useTryInventoryItem(keyUid);
  const wait = useTimer();

  function addUnlockedItemToInventory() {
    const unlockedItem = unlockedItemRef.current;
    if (!unlockedItem) return;
    setUnlockedItem(unlockedItem);
    setInventory(inventory.unlockContainer(unlockedItem, caseUid, keyUid));
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
      const unlockedItem = caseItem.unlockContainer();
      unlockedItemRef.current = unlockedItem;
      wait(() => {
        setHideCaseContents(true);
        if (caseItem.keys !== undefined) playSound("case_unlock");
        wait(() => {
          setItems(range(32).map((_, i) => (i === 28 ? unlockedItem : unlockNonSpecialItem(caseItem))));
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
    const openCount = 1000;
    const results: Record<number, number> = {};

    for (let i = 0; i < openCount; i++) {
      const unlockedItem = caseItem.unlockContainer();
      results[unlockedItem.id] = (results[unlockedItem.id] || 0) + 1;
    }

    const output = Object.entries(results)
      .map(([id, count]) => {
        const item = CS2Economy.getById(Number(id));
        const percentage = ((count / openCount) * 100).toFixed(2);
        return `${item.name} (${item.rarity}): ${count} (${percentage}%)`;
      })
      .join("\n");

    console.log("🔹 Статистика по 1000 открытиям кейса:");
    console.log(output);
    alert("✅ Имитация 1000 открытий завершена. Смотри консоль для статистики.");
  }

  const handleUnlock = OPEN_CASE_MODE === "SIMULATION"
    ? handleUnlockSimulation
    : handleUnlockClassic;

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
          canUnlock={true}
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
