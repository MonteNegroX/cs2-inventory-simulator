import fs from "fs";
import { parse } from "csv-parse/sync";

// Загружаем CSV
const csvContent = fs.readFileSync("actual_gifts_only_dynamic_with_ids.csv", "utf-8");
const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
});

// Сортировка по cs2_id (как строка и число, чтобы избежать ошибок)
records.sort((a, b) => Number(a.cs2_id) - Number(b.cs2_id));

// Загружаем текущий JSON
const overrides = JSON.parse(fs.readFileSync("overrides.json", "utf-8"));

// Обновляем price в JSON
for (const row of records) {
    const id = row.cs2_id;
    const floorTON = row.floor_TON;

    if (!id || !floorTON) continue;
    if (!overrides[id]) continue;

    // Добавляем/обновляем price в JSON
    overrides[id]["price"] = floorTON;
}

// Сохраняем обновлённый JSON
fs.writeFileSync("overrides.json", JSON.stringify(overrides, null, 2), "utf-8");

console.log("✅ overrides.json успешно обновлён с параметрами price из CSV.");
