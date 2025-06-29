import pandas as pd
import shutil
import datetime

# Создаем бэкап с отметкой времени
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
backup_filename = f"Override_giftsonly_CSV_backup_{timestamp}.csv"
shutil.copyfile("gifts_only_stable.csv", backup_filename)
print(f"✅ Создан бэкап: {backup_filename}")

# Загружаем CSV
df = pd.read_csv("gifts_only_stable.csv")

# Извлекаем ID из marketapp_url
df["OVERRIDE_COLLECTION_ID"] = df["marketapp_url"].str.extract(r'collection/([^/]+)')

# Сохраняем обратно, не трогая старые данные
df.to_csv("gifts_only_stable.csv", index=False)

print("✅ Колонка 'OVERRIDE_COLLECTION_ID' добавлена и файл обновлен без удаления строк и колонок.")
