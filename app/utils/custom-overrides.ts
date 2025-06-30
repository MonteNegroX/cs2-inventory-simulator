import rawOverrides from "../../overrides.json";
import { CS2EconomyItem } from "@ianlucas/cs2-lib";

interface CustomOverride {
    name?: string;
    image?: string;
    contents?: number[];
    price?: number[];
    animation?: string; // путь к lottie json
}

// Приведение ключей к числам для строгой типизации
export const CUSTOM_OVERRIDES: Record<number, CustomOverride> = Object.fromEntries(
    Object.entries(rawOverrides).map(([key, value]) => [Number(key), value])
);

export function applyCustomOverrides(item: CS2EconomyItem): CS2EconomyItem {
    const override = CUSTOM_OVERRIDES[item.id];
    if (override) {
        if (override.name) {
            item.name = override.name;
        }
        if (override.image) {
            item.image = override.image;
        }
        if (override.price) {
          const p = parseFloat(override.price);
          if (!isNaN(p)) item.price = p;
          }
        if (override.contents) {
            console.log(`✅ Applying contents override to case ${item.id}`);
            item.contents = override.contents;
        }
        if (override.animation) {
          (item as any).animation = override.animation;
        }
    }
    return item;
}
