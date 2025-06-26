/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { parseInventory } from "./inventory";
import { getFromLocalStorage, setToLocalStorage } from "./localstorage";

export function cacheInventoryData(value: string) {
  return setToLocalStorage("inventoryItems", value);
}

export function getCachedInventoryData() {
  return {
    items: {
      "1": { id: 9504, equipped: false }, // Prisma Case
      "2": { id: 4003, equipped: false }, // Clutch Case
      "3": { id: 4004, equipped: false }, // Spectrum Case
      "4": { id: 4005, equipped: false }, // Fracture Case
      "5": { id: 4006, equipped: false }, // Snakebite Case
      "6": { id: 5001, equipped: false }, // Sticker Capsule 2
      "7": { id: 5002, equipped: false }, // Sticker Capsule 3
      "8": { id: 5003, equipped: false }, // Community Capsule 2018
      "9": { id: 5004, equipped: false }, // CS20 Sticker Capsule
      "10": { id: 5005, equipped: false } // Riptide Sticker Capsule
    }
  };
}
    //return parseInventory(getFromLocalStorage("inventoryItems"));


export function getSanitizedCachedInventoryData() {
  const data = getCachedInventoryData();
  if (data === undefined) {
    return undefined;
  }
  return {
    ...data,
    items: Object.fromEntries(
      Object.entries(data.items).map(([uid, value]) => [
        uid,
        {
          ...value,
          equipped: undefined,
          equippedCT: undefined,
          equippedT: undefined,
          statTrak: value.statTrak !== undefined ? (0 as const) : undefined,
          storage:
            value.storage !== undefined
              ? Object.fromEntries(
                  Object.entries(value.storage).map(([uid, value]) => [
                    uid,
                    {
                      ...value,
                      statTrak:
                        value.statTrak !== undefined ? (0 as const) : undefined,
                      storage: undefined
                    }
                  ])
                )
              : undefined
        }
      ])
    )
  };
}
