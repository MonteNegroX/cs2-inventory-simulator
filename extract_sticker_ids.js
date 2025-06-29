import fs from "fs";

// Загружаем items-ids.json
const ids = JSON.parse(fs.readFileSync("./items-ids.json", "utf-8"));

// Фильтруем по "sticker_"
const stickerIds = ids.filter(id => id.startsWith("sticker_")).slice(0, 400);

// Вывод и сохранение
console.log(`✅ Найдено ${stickerIds.length} стикеров.`);

fs.writeFileSync("stickers_400.json", JSON.stringify(stickerIds, null, 2), "utf-8");
console.log("✅ Данные сохранены в stickers_400.json");