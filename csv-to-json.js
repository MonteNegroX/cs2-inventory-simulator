import fs from "fs";
import { parse } from "csv-parse/sync";

// Загружаем CSV
const csvContent = fs.readFileSync("overrides_updated.csv", "utf-8");
const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
});

const result = {};

// Формируем структуру
for (const row of records) {
    const id = Number(row.id);
    if (isNaN(id)) continue;

    const entry = {};
    if (row.name) entry.name = row.name;

    if (row.image) {
        // Заменяем ссылку fragment на локальную папку
        entry.image = row.image.replace(
            "https://nft.fragment.com/collection/",
            "downloaded_webp/"
        );
    }

    if (row.contents) {
        entry.contents = row.contents
            .split(";")
            .map(x => Number(x.trim()))
            .filter(Boolean);
    }

    result[id] = entry;
}

// Сохраняем в JSON
fs.writeFileSync("overrides.json", JSON.stringify(result, null, 2), "utf-8");

console.log("✅ overrides.json успешно обновлен с локальными путями!");
