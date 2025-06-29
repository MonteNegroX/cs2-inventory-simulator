import csv
import json
import shutil
import os
from collections import defaultdict
from tqdm import tqdm

# Цвета по редкости
rarity_to_color = {
    "Rare": "#4b69ff",
    "Mythical": "#8847ff",
    "Legendary": "#d32ce6",
    "Ancient": "#eb4b4b",
    "Immortal": "#e4ae39"
}

CSV_FILE = 'actual_gifts_only_dynamic.csv'
ITEMS_JSON = 'items.json'
OUTPUT_FILE = 'actual_gifts_only_dynamic_with_ids.csv'

# 1️⃣ Бэкап перед изменениями
timestamp = __import__('time').strftime("%Y%m%d-%H%M%S")
backup_name = f"{CSV_FILE}_backup_{timestamp}.csv"
shutil.copyfile(CSV_FILE, backup_name)
print(f"✅ Backup создан: {backup_name}")

# 2️⃣ Считаем сколько нужно каждого rarity
rarity_needed = defaultdict(int)
rows = []
with open(CSV_FILE, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = [row for row in reader]
    for row in rows:
        rarity = row.get('rarity', '').strip()
        if rarity:
            rarity_needed[rarity] += 1

print(f"📊 Требуется по количеству:")
for rarity, count in rarity_needed.items():
    print(f"   {rarity}: {count}")

# 3️⃣ Загружаем items.json
with open(ITEMS_JSON, 'r', encoding='utf-8') as f:
    items = json.load(f)

# 4️⃣ Группируем id по цвету и типу
color_to_ids = defaultdict(list)
for item in items:
    if item.get('type') == 'sticker':
        color = item.get('rarity')
        id_ = item.get('id')
        if color and id_ is not None:
            color_to_ids[color].append(id_)

# 5️⃣ Подбор id для каждой rarity
rarity_to_ids = defaultdict(list)
for rarity, needed_count in rarity_needed.items():
    color = rarity_to_color.get(rarity)
    available_ids = color_to_ids.get(color, [])
    if len(available_ids) < needed_count:
        print(f"⚠️ Недостаточно id для {rarity}: нужно {needed_count}, есть {len(available_ids)}")
    chosen_ids = available_ids[:needed_count]
    rarity_to_ids[rarity] = chosen_ids
    # Убираем уже выбранные id
    color_to_ids[color] = available_ids[needed_count:]

# 6️⃣ Добавляем cs2_id в таблицу
if 'cs2_id' not in rows[0]:
    fieldnames = list(rows[0].keys()) + ['cs2_id']
else:
    fieldnames = list(rows[0].keys())

# Счётчики использования id
rarity_id_index = defaultdict(int)

with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f_out:
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer.writeheader()

    for row in tqdm(rows, desc="🔄 Присвоение cs2_id"):
        rarity = row.get('rarity', '').strip()
        if rarity and rarity in rarity_to_ids:
            idx = rarity_id_index[rarity]
            ids_list = rarity_to_ids[rarity]
            if idx < len(ids_list):
                row['cs2_id'] = ids_list[idx]
                rarity_id_index[rarity] += 1
            else:
                row['cs2_id'] = ''
        else:
            row['cs2_id'] = ''
        writer.writerow(row)

print(f"\n✅ Завершено. Создан файл: {OUTPUT_FILE}")
