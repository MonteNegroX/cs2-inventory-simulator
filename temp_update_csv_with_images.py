import json
import csv
import shutil
from difflib import SequenceMatcher

# Настройки
JSON_FILE = 'fragment_images.json'
CSV_FILE = 'gifts_only_stable.csv'
BACKUP_FILE = 'gifts_only_stable_backup.csv'
SIMILARITY_THRESHOLD = 0.92  # ~2 символа допуск при малой длине

def is_similar(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio() >= SIMILARITY_THRESHOLD

def main():
    # Бекап
    shutil.copyfile(CSV_FILE, BACKUP_FILE)
    print(f"✅ Backup создан: {BACKUP_FILE}")

    # Загрузка JSON
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        fragments = json.load(f)

    # Загрузка CSV
    rows = []
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            rows.append(row)

    updated_count = 0

    for row in rows:
        csv_name = row.get('name', '').strip()
        csv_link = row.get('marketapp_url', '').strip()
        csv_image = row.get('image', '').strip()

        if csv_image:  # уже заполнено
            continue

        for fragment in fragments:
            frag_name = fragment.get('name', '').strip()
            frag_link = fragment.get('link', '').strip()
            frag_image = fragment.get('image', '').strip()

            name_match = is_similar(csv_name, frag_name)
            link_match = is_similar(csv_link, frag_link)

            if name_match or link_match:
                row['image'] = frag_image
                updated_count += 1
                print(f"✅ Обновлено для: {csv_name} -> {frag_image}")
                break

    # Сохранение CSV
    with open(CSV_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"🎉 Обновлено {updated_count} строк в {CSV_FILE}")

if __name__ == "__main__":
    main()
