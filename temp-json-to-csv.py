import json
import csv

# Загружаем JSON
with open("collections_links.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Создаем CSV
with open("gifts_only_stable.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "marketapp_url"])
    writer.writeheader()
    for item in data:
        writer.writerow({
            "name": item.get("Collection", ""),
            "marketapp_url": item.get("link", "")
        })

print("✅ Данные успешно перенесены в gifts_only_stable.csv")
