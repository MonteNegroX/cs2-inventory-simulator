/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assert, CS2EconomyItem } from "@ianlucas/cs2-lib";
import { useToggle } from "@uidotdev/usehooks";
import { useState } from "react";
import { dispatchAppEvent } from "~/app";
import { SyncAction } from "~/data/sync";
import { toArrayIf } from "~/utils/misc";
import { range } from "~/utils/number";
import { useInventory, useRules, useTranslate } from "./app-context";
import { useSync } from "./hooks/use-sync";
import { ItemEditor, ItemEditorAttributes } from "./item-editor";
import { Modal, ModalHeader } from "./modal";
import { ModalButton } from "./modal-button";
import { Select } from "./select";
import { useFakeWalletBalance} from "~/components/hooks/useFakeWalletBalance";
import { useWalletBalance } from "~/components/WalletBalanceContext";

const KEY_MAX_QUANTITY = 20;
const KEY_PRICE = 1.5; // 🔧 стоимость ключа в TON

export function UnlockCaseContainerAddKey({
  caseUid,
  neededKeyItem
}: {
  caseUid: number;
  neededKeyItem: CS2EconomyItem;
}) {
  const translate = useTranslate();
  const sync = useSync();
  const [inventory, setInventory] = useInventory();
  const { craftMaxQuantity, inventoryMaxItems } = useRules();
  const [amount, setAmount] = useState("1");
  const [isCrafting, toggleIsCrafting] = useToggle(false);
  const [attributes, setAttributes] = useState<ItemEditorAttributes>();
  const { balance, deduct } = useWalletBalance(); // 🔧 добавлен вызов баланса
  const [error, setError] = useState(""); // 🔧 состояние для ошибки



  const maxQuantity = Math.min(
    inventoryMaxItems - inventory.size(),
    KEY_MAX_QUANTITY,
    ...toArrayIf(craftMaxQuantity, (n) => n > 0)
  );

  function handleClose() {
    toggleIsCrafting();
    setError(""); // 🔧 сброс ошибки при закрытии

  }

  function handleCraft() {
    assert(attributes);
    const totalPrice = attributes.quantity * KEY_PRICE; // 🔧 расчёт итоговой стоимости
    if (!deduct(totalPrice)) {
      setError(`Not enough TON. You need ${totalPrice.toFixed(2)} TON.`);
      return;
    }

    setError(""); // 🔧 очистка ошибки

    const inventoryItem = { id: neededKeyItem.id };
    range(attributes.quantity).forEach(() => {
      setInventory(inventory.add(inventoryItem));
      sync({
        type: SyncAction.Add,
        item: inventoryItem
      });
    });
    const firstKey = inventory
      .getAll()
      .find((item) => item.id === neededKeyItem.id);
    if (firstKey !== undefined) {
      dispatchAppEvent("unlockcase", {
        caseUid,
        keyUid: firstKey.uid
      });
    }
    toggleIsCrafting(); // 🔧 закрыть модалку после крафта

  }

  return maxQuantity === 0 ? null : (
    <div className="mr-2 flex items-center gap-2 border-r border-r-white/10 pr-4">
      <Select
        direction="up"
        value={amount}
        onChange={setAmount}
        options={range(maxQuantity).map((n) => ({
          value: (n + 1).toString()
        }))}
        noMaxHeight
        className="min-w-[64px]"
        optionsStyles="max-h-[256px] overflow-y-scroll"
      />
      <ModalButton
        children={translate("CaseAdd")}
        variant="primary"
        onClick={toggleIsCrafting} // 🔧 раньше был handleClose
      />
      {isCrafting && (
        <Modal className="w-[420px]" fixed>
          <ModalHeader
            title={translate("CaseAddKeyConfirm")}
            onClose={handleClose}
          />
          <ItemEditor
            className="px-4"
            defaultQuantity={Number(amount)}
            item={neededKeyItem}
            maxQuantity={maxQuantity}
            onChange={setAttributes}
          />
          <div className="my-2 text-center text-sm text-white">
            Key price: {KEY_PRICE} TON / each — You have {balance.toFixed(2)} TON
          </div>
          {error && (
            <div className="mb-2 text-center text-sm text-red-400">{error}</div>
          )}
          <div className="my-6 flex justify-center gap-2">
            <ModalButton
              children={translate("EditorCancel")}
              onClick={handleClose}
              variant="secondary"
            />
            <ModalButton
              children={translate("EditorCraft")}
              onClick={handleCraft}
              variant="primary"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
