/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2Economy, CS2Inventory, CS2InventorySpec } from "@ianlucas/cs2-lib";
import {
  ContextType,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo
} from "react";
import { useInventoryFilterState } from "~/components/hooks/use-inventory-filter-state";
import { useInventoryState } from "~/components/hooks/use-inventory-state";
import { useTranslation } from "~/components/hooks/use-translation";
import { SyncAction } from "~/data/sync";
import type { loader } from "~/root";
import { pushToSync, sync } from "~/sync";
import { getFreeItemsToDisplay, parseInventory } from "~/utils/inventory";
import {
  cacheInventoryData,
  getCachedInventoryData,
  getSanitizedCachedInventoryData
} from "~/utils/inventory-cached-data";
import {
  TransformedInventoryItems,
  sortItemsByEquipped,
  transform
} from "~/utils/inventory-transform";
import { SerializeFrom } from "~/utils/misc";
import { cacheAuthenticatedUserId } from "~/utils/user-cached-data";

const AppContext = createContext<
  {
    inventory: CS2Inventory;
    inventoryFilter: ReturnType<typeof useInventoryFilterState>;
    items: TransformedInventoryItems;
    setInventory: (value: CS2Inventory) => void;
    translation: ReturnType<typeof useTranslation>;
    env: {
      OPEN_CASE_MODE: string;
    };
  } & SerializeFrom<typeof loader>
>(null!);

export function useAppContext() {
  return useContext(AppContext);
}

export function useTranslate() {
  return useAppContext().translation.translate;
}

export function useRules() {
  return useAppContext().rules;
}

export function usePreferences() {
  return useAppContext().preferences;
}

export function useInventory() {
  const { inventory, setInventory } = useAppContext();
  return [inventory, setInventory] as const;
}

export function useUser() {
  return useAppContext().user;
}

export function useInventoryItems() {
  return useAppContext().items;
}

export function useInventoryFilter() {
  return useAppContext().inventoryFilter;
}

export function AppProvider({
  children,
  preferences,
  rules,
  user,
  env
}: Omit<
  ContextType<typeof AppContext>,
  "inventory" | "inventoryFilter" | "items" | "translation" | "setInventory"
> & {
  children: ReactNode;
  env: { OPEN_CASE_MODE: string };
}) {
  const inventorySpec = {
    data: user?.inventory
      ? parseInventory(user?.inventory)
      : rules.appCacheInventory
        ? getCachedInventoryData()
        : undefined,
    maxItems: rules.inventoryMaxItems,
    storageUnitMaxItems: rules.inventoryStorageUnitMaxItems
  } satisfies Partial<CS2InventorySpec>;

  const [inventory, setInventory, reactSetInventory] = useInventoryState(
    () => new CS2Inventory(inventorySpec)
  );
  const inventoryFilter = useInventoryFilterState();
  const translation = useTranslation({
    language: preferences.language
  });

  useEffect(() => {
    CS2Economy.baseUrl = rules.assetsBaseUrl ?? CS2Economy.baseUrl;
  }, [rules.assetsBaseUrl]);

  useEffect(() => {
    cacheInventoryData(inventory.stringify());
  }, [inventory]);

  useEffect(() => {
    if (user !== undefined) {
      if (rules.appCacheInventory && user.inventory === null) {
        const cachedData = getSanitizedCachedInventoryData();
        if (cachedData !== undefined) {
          pushToSync({
            type: SyncAction.AddFromCache,
            data: cachedData
          });
          setInventory(
            new CS2Inventory({
              ...inventorySpec,
              data: cachedData
            })
          );
        }
      }
      cacheAuthenticatedUserId(user.id);
      sync.syncedAt = user.syncedAt.getTime();
    }
  }, [user]);

  const items = useMemo(
    () =>
      (preferences.hideFilters
        ? sortItemsByEquipped
        : inventoryFilter.sortItems)(
        inventory.getAll().map((item) =>
          transform(item, {
            models: rules.inventoryItemEquipHideModel,
            types: rules.inventoryItemEquipHideType
          })
        ),
        getFreeItemsToDisplay(preferences.hideFreeItems)
      ),
    [
      inventory,
      preferences.hideFreeItems,
      preferences.hideFilters,
      rules.inventoryItemEquipHideModel,
      rules.inventoryItemEquipHideType,
      inventoryFilter.sortItems
    ]
  );

  // ✅ Добавляем обработчик кастомного события для фильтрации при нажатии футера
  useEffect(() => {
    const handler = () => {
      const primaryIndex = INVENTORY_PRIMARY_FILTERS.indexOf("GraphicArt");
      const secondaryIndex = INVENTORY_SECONDARY_FILTERS["GraphicArt"].indexOf("Stickers");

      // Вызываем клики для установки фильтра
      inventoryFilter.handlePrimaryClick(primaryIndex)();
      inventoryFilter.handleSecondaryClick(secondaryIndex)();
    };

    window.addEventListener("set-filters-graphicart-stickers", handler);

    return () => {
      window.removeEventListener("set-filters-graphicart-stickers", handler);
    };
  }, [inventoryFilter]);

  return (
    <AppContext.Provider
      value={{
        inventory,
        inventoryFilter,
        items,
        translation,
        preferences,
        rules,
        setInventory,
        user,
        env
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

