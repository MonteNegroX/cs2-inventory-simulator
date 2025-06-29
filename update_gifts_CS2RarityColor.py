import csv
import time
import shutil
import os
from tqdm import tqdm
import numpy as np
from collections import defaultdict

CSV_FILE = 'actual_gifts_only_dynamic.csv'

# 1️⃣ Бэкап перед изменениями
timestamp = time.strftime("%Y%m%d-%H%M%S")
backup_name = f"{CSV_FILE}_backup_{timestamp}.csv"
shutil.copyfile(CSV_FILE, backup_name)
print(f"✅ Backup создан: {backup_name}")

# 2️⃣ Загрузка данных
with open(CSV_FILE, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    if not reader.fieldnames:
        print(f"❌ Ошибка: В файле {CSV_FILE} отсутствуют заголовки или файл пуст.")
        exit(1)
    rows = [row for row in reader]
    fieldnames = reader.fieldnames.copy()

# 3️⃣ Добавляем колонку rarity, если нет
if 'rarity' not in fieldnames:
    fieldnames.append('rarity')

# 4️⃣ Готовим floor_TON список
floors = []
for row in rows:
    floor_ton_str = (row.get('floor_TON') or '').strip()
    try:
        floor = float(floor_ton_str)
        floors.append(floor)
    except ValueError:
        continue

# Проверка
if not floors:
    print("❌ Нет данных с floor_TON для анализа.")
    exit(1)

# 5️⃣ Вычисляем процентильные границы
percentiles = np.percentile(floors, [50, 70, 85, 95])
p50, p70, p85, p95 = percentiles
print(f"\n📊 Границы по актуальным ценам TON:")
print(f"   p50 (Rare/Mythical): {p50:.1f} TON")
print(f"   p70 (Mythical/Legendary): {p70:.1f} TON")
print(f"   p85 (Legendary/Ancient): {p85:.1f} TON")
print(f"   p95 (Ancient/Immortal): {p95:.1f} TON\n")

# 6️⃣ Присвоение категории
def determine_rarity_dynamic(floor_ton, p50, p70, p85, p95):
    if floor_ton >= p95:
        return 'Immortal'
    elif floor_ton >= p85:
        return 'Ancient'
    elif floor_ton >= p70:
        return 'Legendary'
    elif floor_ton >= p50:
        return 'Mythical'
    else:
        return 'Rare'

rarity_counter = defaultdict(int)
rarity_prices = defaultdict(list)

with tqdm(total=len(rows), desc="🔄 Присвоение категорий", unit="item") as pbar:
    for row in rows:
        floor_ton_str = (row.get('floor_TON') or '').strip()
        try:
            floor_ton = float(floor_ton_str)
            rarity = determine_rarity_dynamic(floor_ton, p50, p70, p85, p95)
            row['rarity'] = rarity
            rarity_counter[rarity] += 1
            rarity_prices[rarity].append(floor_ton)
        except (ValueError, TypeError):
            row['rarity'] = ''
        pbar.update(1)

# 7️⃣ Сохраняем обновлённый CSV
with open(CSV_FILE, 'w', encoding='utf-8', newline='') as f_out:
    writer = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

# 8️⃣ Создание actual_ копии
actual_name = f"actual_{CSV_FILE}"
shutil.copyfile(CSV_FILE, actual_name)
print(f"✅ Создана копия: {actual_name}")

# 9️⃣ Итоговая статистика
print("\n📊 Статистика распределения с диапазоном цен:")
total = sum(rarity_counter.values())

for rarity in ['Rare', 'Mythical', 'Legendary', 'Ancient', 'Immortal']:
    count = rarity_counter[rarity]
    if rarity_prices[rarity]:
        min_price = min(rarity_prices[rarity])
        max_price = max(rarity_prices[rarity])
        print(f"   {rarity}: {count} ({(count/total*100):.1f}%) | Диапазон: {min_price:.1f} - {max_price:.1f} TON")
    else:
        print(f"   {rarity}: {count} ({(count/total*100):.1f}%) | Диапазон: -")

print(f"\n🎉 Завершено: данные обновлены в {CSV_FILE}\n")
