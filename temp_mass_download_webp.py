import os
import pandas as pd
import requests
from tqdm import tqdm

# Создаем папку для загрузок
os.makedirs("downloaded_webp", exist_ok=True)

# Загружаем CSV со ссылками
df = pd.read_csv("fragment_links.csv")

# Проверка на наличие колонки url
if "url" not in df.columns:
    raise ValueError("В CSV должна быть колонка 'url' со ссылками.")

# Скачиваем каждую ссылку
for url in tqdm(df["url"], desc="Загрузка изображений"):
    try:
        if not isinstance(url, str) or not url.strip():
            continue

        response = requests.get(url, timeout=10)
        response.raise_for_status()

        filename = os.path.basename(url.split("?")[0])
        filepath = os.path.join("downloaded_webp", filename)

        with open(filepath, "wb") as f:
            f.write(response.content)

    except Exception as e:
        print(f"❌ Ошибка загрузки {url}: {e}")

print("✅ Загрузка завершена. Файлы сохранены в папке 'downloaded_webp'.")
