import { russian } from "@ianlucas/cs2-lib/translations";

export function patchLocalization() {
  if (locale["ru"] && locale["ru"]["8471"]) {
    locale["ru"]["8471"].name = "ChatGPT Sticker";
    console.log("✅ Патч локали применён:", locale["ru"]["8471"]); // ✅ Перенесено внутрь
  } else {
    console.log("❌ Не удалось применить патч локали: ключ не найден");
  }
}
