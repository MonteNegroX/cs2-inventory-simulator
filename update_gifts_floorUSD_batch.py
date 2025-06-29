import csv
import json
import subprocess
import shutil
import os
import time

CSV_INPUT = 'gifts_only_stable.csv'
CSV_OUTPUT = 'gifts_only_dynamic.csv'

# 1️⃣ Делаем бэкап OUTPUT перед запуском
if os.path.exists(CSV_OUTPUT):
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    backup_name = f"{CSV_OUTPUT}_backup_{timestamp}.csv"
    shutil.copyfile(CSV_OUTPUT, backup_name)
    print(f"✅ Backup создан: {backup_name}")

# 2️⃣ Считываем CSV_INPUT
with open(CSV_INPUT, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = [row for row in reader]

# 3️⃣ Собираем targetUrls
target_urls = list({row['marketapp_url'].strip() for row in rows if row.get('marketapp_url', '').strip()})

# Сохраняем во временный JSON
with open('target_urls.json', 'w', encoding='utf-8') as f:
    json.dump(target_urls, f, indent=2)

# 4️⃣ Запускаем Puppeteer batch
print("⏳ Запуск Puppeteer для массового парсинга...")
result = subprocess.run(
    ['node', 'puppeteer-fetch-batch.js', 'target_urls.json'],
    capture_output=True, text=True, timeout=300
)

parsed_data = json.loads(result.stdout)
url_to_floor = {item['url']: item['floor_USD'] for item in parsed_data}

# 5️⃣ Записываем CSV_OUTPUT с name + floor_USD
with open(CSV_OUTPUT, 'w', encoding='utf-8', newline='') as f_out:
    writer = csv.DictWriter(f_out, fieldnames=['name', 'floor_USD'])
    writer.writeheader()

    updated = 0
    for row in rows:
        name = row.get('name', '').strip()
        url = row.get('marketapp_url', '').strip()
        floor = url_to_floor.get(url, '')

        writer.writerow({
            'name': name,
            'floor_USD': floor
        })

        if floor:
            updated += 1

print(f"\n🎉 Завершено: обновлено {updated} строк в {CSV_OUTPUT}")

# 6️⃣ Создаём actual_ при успехе
if updated > 0:
    actual_name = f"actual_{CSV_OUTPUT}"
    shutil.copyfile(CSV_OUTPUT, actual_name)
    print(f"✅ Создана копия: {actual_name}")
