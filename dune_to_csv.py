from dune_client.client import DuneClient
import pandas as pd

# Укажи свой API ключ Dune
API_KEY = "73cyJ6HdS0HbavbLv0aMNpiB4kUbJTau"
QUERY_ID = 5129531  # замени на свой ID

# Инициализация клиента
dune = DuneClient(API_KEY)

# Получение последнего результата запроса
query_result = dune.get_latest_result(QUERY_ID)

# Преобразование в pandas DataFrame
rows = query_result.result.rows
df = pd.DataFrame(rows)

# Выбор только нужных колонок
desired_columns = ["character", "collection", "cur_price"]
df = df[desired_columns]

# Вывод названий колонок
print("Columns:", df.columns.tolist())

# Вывод первых 2 строк для проверки
print(df.head(2))

# Сохранение в CSV
df.to_csv("result.csv", index=False, encoding="utf-8-sig")

print("✅ Данные сохранены в 'result.csv'")
