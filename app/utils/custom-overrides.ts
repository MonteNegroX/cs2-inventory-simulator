import { CS2EconomyItem } from "@ianlucas/cs2-lib";

interface CustomOverride {
    name?: string;
    image?: string;
    contents?: number[]; // ✅ добавляем поле для override contents
}

export const CUSTOM_OVERRIDES: Record<number, CustomOverride> = {
    8471: {
        name: "LootBag",
        image: "http://localhost:3007/images/lootbag.png",
    },
    9504: {
        contents: [8471, 8473, 8475, 8472], // ✅ пример кастомного содержимого кейса
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
        if (override.contents && item.contents) { // ✅ проверяем что это контейнер
            console.log(`✅ Applying contents override to case ${item.id}`);
            item.contents = override.contents;
        }
    }
    return item;
}
