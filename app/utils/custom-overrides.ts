import { CS2EconomyItem } from "@ianlucas/cs2-lib";

interface CustomOverride {
    name?: string;
    image?: string;
}

export const CUSTOM_OVERRIDES: Record<number, CustomOverride> = {
    8471: {
        name: "ChatGPT Sticker",
        image: "https://i.imgur.com/YOUR_IMAGE_LINK.png"
    },
    // Добавляй сюда другие кастомные предметы
};

export function applyCustomOverrides(item: CS2EconomyItem): CS2EconomyItem {
    const override = CUSTOM_OVERRIDES[item.id];
    if (override) {
        if (override.name) {
            item.name = override.name;
        }
        if (override.image) {
            item.image = override.image;
        }
    }
    return item;
}
