import csv
import subprocess
import shutil
import os
import time
from tqdm import tqdm

CSV_INPUT = 'gifts_only_stable.csv'
CSV_OUTPUT = 'gifts_only_dynamic.csv'
CSV_ERROR_OUTPUT = 'error_update_gifts_floorUSD.csv'

# 1️⃣ Делаем бэкап OUTPUT перед запуском, если существует
if os.path.exists(CSV_OUTPUT):
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    backup_name = f"{CSV_OUTPUT}_backup_{timestamp}.csv"
    shutil.copyfile(CSV_OUTPUT, backup_name)
    print(f"✅ Backup создан: {backup_name}")

# 2️⃣ Загружаем INPUT
with open(CSV_INPUT, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    if not reader.fieldnames:
        print(f"❌ Ошибка: В файле {CSV_INPUT} отсутствуют заголовки или файл пуст.")
        exit(1)
    rows = [row for row in reader]

# 3️⃣ Устанавливаем поля для OUTPUT
fieldnames = ['name', 'floor_USD']

# 4️⃣ Последовательная обработка
with open(CSV_OUTPUT, 'w', encoding='utf-8', newline='') as f_out, \
     open(CSV_ERROR_OUTPUT, 'w', encoding='utf-8', newline='') as f_err:

    writer_out = csv.DictWriter(f_out, fieldnames=fieldnames)
    writer_err = csv.DictWriter(f_err, fieldnames=fieldnames)
    writer_out.writeheader()
    writer_err.writeheader()

    with tqdm(total=len(rows), desc="🔄 Обработка URL", unit="url") as pbar:
        for idx, row in enumerate(rows, 1):
            name = row.get('name', '').strip()
            url = row.get('marketapp_url', '').strip()
            floor_price = ''

            if url:
                try:
                    print(f"⏳ [{idx}] {name}: запрашиваю floor_USD...")
                    result = subprocess.run(
                        ['node', 'puppeteer-floor-fetcher.js', url],
                        capture_output=True, text=True, timeout=90
                    )
                    floor_price = result.stdout.strip()

                    if not floor_price:
                        print(f"⏳ [{idx}] {name}: не получено, повтор через 10 секунд...")
                        time.sleep(10)
                        result = subprocess.run(
                            ['node', 'puppeteer-floor-fetcher.js', url],
                            capture_output=True, text=True, timeout=90
                        )
                        floor_price = result.stdout.strip()

                except Exception as e:
                    print(f"❌ [{idx}] {name}: ошибка {e}")
            else:
                print(f"⚠️ [{idx}] {name}: нет marketapp_url")

            output_row = {
                'name': name,
                'floor_USD': floor_price
            }

            if floor_price:
                writer_out.writerow(output_row)
                print(f"\n✅ [{idx}] {name}: floor_USD = {floor_price} | записано")
            else:
                writer_err.writerow(output_row)
                print(f"❌ [{idx}] {name}: не удалось получить floor_USD, записано в ошибки")

            pbar.update(1)

# 5️⃣ Создание actual_ копии, если ошибок нет
errors = sum(1 for _ in open(CSV_ERROR_OUTPUT, 'r', encoding='utf-8')) - 1  # исключаем заголовок
if errors == 0:
    actual_name = f"actual_{CSV_OUTPUT}"
    shutil.copyfile(CSV_OUTPUT, actual_name)
    print(f"✅ Все строки обновлены без ошибок. Создана копия: {actual_name}")
else:
    print(f"⚠️ Копия actual_ не создана, так как есть {errors} ошибок.")

print(f"\n🎉 Завершено: данные обновлены в {CSV_OUTPUT}")
print(f"🚫 Количество ошибок: {errors}, подробности в {CSV_ERROR_OUTPUT}")
