// app/utils/economy.server.ts

import { USE_CUSTOM_ITEMS } from "~/env.server";
import { CS2Economy, CS2_ITEMS } from "@ianlucas/cs2-lib";
import { loadCustomItems } from "~/utils/economy";

/**
 * Инициализирует экономику CS2 при запуске сервера.
 * Вызывать ТОЛЬКО в server environment (entry.server.tsx или loaders),
 * НИКОГДА не импортировать в client/components, чтобы избежать ошибок Vite.
 */
export function initEconomy(language: string) {
    try {
        if (USE_CUSTOM_ITEMS) {
            console.log("[Startup] Using CUSTOM ITEMS...");
            loadCustomItems(language);
        } else {
            console.log("[Startup] Using CS2-LIB ITEMS...");
        }

        CS2Economy.use({
            items: CS2_ITEMS,
            language
        });

        console.log(`[Startup] CS2Economy initialized with language: ${language}`);
    } catch (error) {
        console.error("[Startup] Failed to initialize CS2Economy:", error);
    }
}
