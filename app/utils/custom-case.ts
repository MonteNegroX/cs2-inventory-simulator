import { CustomItem, CUSTOM_ITEMS } from "~/utils/custom-items";

/**
 * Описание кастомного кейса
 */
export interface CustomCase {
    id: number;
    name: string;
    image: string;
    items: CustomItem[];
}

export const CUSTOM_CASE: CustomCase = {
    id: 100001,
    name: "ChatGPT Custom Case",
    image: "https://i.imgur.com/7f5TiXy.png", // картинка кейса
    items: CUSTOM_ITEMS // наши 2 кастомных предмета
};
