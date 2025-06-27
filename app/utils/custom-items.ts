import customItems from "~/data/custom-items.json";

export interface CustomItem {
    id: number;
    name: string;
    rarity: string;
    type: string;
    image: string;
    weight: number;
}

export const CUSTOM_ITEMS: CustomItem[] = customItems;
