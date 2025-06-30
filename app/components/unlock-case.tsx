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
import { applyCustomOverrides } from "~/utils/custom-overrides";

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
    setInventory(prev => {
        let updated = prev.unlockContainer(unlockedItem, caseUid, keyUid);
        updated = updated.addContainer(caseItem); // добавляем дубль кейса
        return updated;
    });
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
    const openCount = 10000;
    const results: Record<number, number> = {};
    let totalValue = 0;

    // 1) Собираем статистику
    for (let i = 0; i < openCount; i++) {
        const unlocked = caseItem.unlockContainer();
        results[unlocked.id] = (results[unlocked.id] || 0) + 1;

        // применяем оверрайд и сразу берём price как число
        const econItem    = CS2Economy.getById(unlocked.id);
        const overridden  = applyCustomOverrides({ ...econItem });
        const priceTon    = overridden.price || 0;

        totalValue += priceTon;
    }

    // 2) Формируем вывод
    const breakdown = Object.entries(results)
        .map(([idStr, count]) => {
            const id         = Number(idStr);
            const econItem   = CS2Economy.getById(id);
            const overridden = applyCustomOverrides({ ...econItem });
            const perc       = (count / openCount) * 100;
            const priceTon   = overridden.price || 0;
            const value      = count * priceTon;

            return {
                text: `${overridden.name} (${overridden.rarity}): ${count} (${perc.toFixed(2)}%) — ${value.toFixed(2)} TON`,
                perc
            };
        })
        .sort((a, b) => b.perc - a.perc)
        .map(e => e.text)
        .join("\n");

    const spent     = 20000; // 1 TON за кейс
    const earned    = totalValue;
    const houseEdge = ((1 - earned / spent) * 100).toFixed(2);

    console.log("🔹 Статистика по 10 000 открытиям кейса:");
    console.log(breakdown);
    console.log(`💰 Потрачено: ${spent} TON`);
    console.log(`💎 Получено: ${earned.toFixed(2)} TON`);
    console.log(`🏠 House Edge: ${houseEdge}%`);

    alert("✅ Имитация завершена. Смотри консоль.");
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
