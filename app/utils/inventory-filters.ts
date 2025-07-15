/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const INVENTORY_PRIMARY_FILTERS = [
  "Everything",
  "Equipment",
  "GraphicArt",
  "Containers",
  "Display"
] as const;

export const INVENTORY_SECONDARY_FILTERS = {
  Everything: undefined,
  Equipment: [
    "AllEquipment",
    "Melee",
    "Pistols",
    "MidTier",
    "Rifles",
    "Misc",
    "Agents",
    "Gloves",
    "MusicKits"
  ],
  GraphicArt: ["AllGraphicArt", "Patches", "Stickers", "Graffiti", "Charms"],
  Containers: [
    "All",
    "WeaponCases",
    "StickerCapsules",
    "GraffitiBoxes",
    "SouvenirCases",
    "Tools"
  ],
  Display: ["All", "Medals", "MusicKits"]
} as const;

export const INVENTORY_SORTERS = [
  { value: "equipped", label: "Equipped" as const },
  { value: "newest", label: "Newest" as const },
  { value: "quality", label: "Quality" as const },
  { value: "alphabetical", label: "Alphabetical" as const },
  { value: "type", label: "Type" as const },
  { value: "collection", label: "Collection" as const }
];

// utils/inventory-filters.ts
export function isContainerItem(item: { name?: string; category?: string }) {
  const name = item.name?.toLowerCase() ?? "";
  const category = item.category?.toLowerCase() ?? "";
  return (
    name.includes("case") ||
    name.includes("container") ||
    name.includes("capsule") ||
    category.includes("container") ||
    category.includes("capsule")
  );
}

