import csv
import requests
import time
import shutil
import os

CSV_FILE = 'actual_gifts_only_dynamic.csv'

# 1️⃣ Получаем курс TON → USD с Binance
try:
    url = "https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    ton_usd_price = float(response.json()["price"])
    print(f"✅ Курс TON с Binance: {ton_usd_price} USD")
except requests.exceptions.RequestException as e:
    print(f"❌ Ошибка запроса к Binance: {e}")
    exit(1)

# 2️⃣ Делаем бэкап
timestamp = time.strftime("%Y%m%d-%H%M%S")
backup_file = f"gifts_only_dynamic_backup_{timestamp}.csv"
shutil.copyfile(CSV_FILE, backup_file)
print(f"✅ Backup создан: {backup_file}")

# 3️⃣ Обновляем floor_TON в CSV
updated = 0

with open(CSV_FILE, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = [row for row in reader]
    fieldnames = reader.fieldnames.copy()

# Добавляем колонку floor_TON если её нет
if 'floor_TON' not in fieldnames:
    fieldnames.append('floor_TON')

for idx, row in enumerate(rows, 1):
    floor_usd_str = row.get('floor_USD', '').strip()
    if floor_usd_str:
        try:
            floor_usd = float(floor_usd_str)
            floor_ton = floor_usd / ton_usd_price
            row['floor_TON'] = f"{floor_ton:.1f}"  # только 1 знак после запятой
            updated += 1
            print(f"✅ [{idx}] {row.get('name', '')}: floor_USD = {floor_usd} -> floor_TON = {row['floor_TON']}")
        except ValueError:
            row['floor_TON'] = ''
            print(f"⚠️ [{idx}] {row.get('name', '')}: Неверный формат floor_USD '{floor_usd_str}', пропуск")
    else:
        row['floor_TON'] = ''
        print(f"⚠️ [{idx}] {row.get('name', '')}: Нет floor_USD, пропуск")

# 4️⃣ Сохраняем обновлённый CSV
with open(CSV_FILE, 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"🎉 Завершено: обновлено {updated} строк в {CSV_FILE} с курсом TON {ton_usd_price} USD")
