import { CustomItem } from "~/utils/custom-items";
import { CustomCase } from "~/utils/custom-case";

export function rollFromCase(customCase: CustomCase): CustomItem {
    const totalWeight = customCase.items.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;

    for (const item of customCase.items) {
        if (rand < item.weight) {
            return item;
        }
        rand -= item.weight;
    }

    return customCase.items[customCase.items.length - 1]; // fallback
}
