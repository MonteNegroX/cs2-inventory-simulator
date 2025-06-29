import pandas as pd

# Загружаем исходные CSV
gifts_df = pd.read_csv("gifts_only_stable.csv")
overrides_df = pd.read_csv("overrides.csv")

# Фильтруем строки с заполненным name и image
filtered_gifts = gifts_df.dropna(subset=["name", "image"])

# Создаём словарь name -> image
name_to_image = dict(zip(filtered_gifts["name"], filtered_gifts["image"]))

# Обновляем overrides_df: если name совпадает, обновляем image
overrides_df["image"] = overrides_df.apply(
    lambda row: name_to_image.get(row["name"], row["image"]),
    axis=1
)

# Сохраняем результат
overrides_df.to_csv("overrides_updated.csv", index=False)

print("✅ overrides_updated.csv успешно создан с обновлёнными image по name.")
