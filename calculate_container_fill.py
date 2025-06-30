import pandas as pd
import json

# === Параметры ===
INPUT_CSV   = "actual_gifts_only_dynamic_with_ids.csv"
OUTPUT_JSON = "container_ids.json"
OPEN_PRICE  = 2.0
HOUSE_EDGE  = 0.07
TARGET_EV   = OPEN_PRICE * (1 - HOUSE_EDGE)

# === Вес CS2 по rarity ===
rarity_to_weight = {
    "Rare":      79.92,
    "Mythical":  15.98,
    "Legendary":  3.20,
    "Ancient":    0.64,
    "Immortal":   0.26
}

# === 1) Читаем и готовим данные ===
df = pd.read_csv(INPUT_CSV)
# убеждаемся, что колонки есть
for col in ("cs2_id","rarity","floor_TON"):
    if col not in df.columns:
        raise RuntimeError(f"❌ Нет колонки «{col}» в {INPUT_CSV}")
# приводим цены к float и отбросим проблемы
df["floor_TON"] = pd.to_numeric(df["floor_TON"], errors="coerce")
df = df.dropna(subset=["cs2_id","rarity","floor_TON"])
df["cs2_id"] = df["cs2_id"].astype(int)

# маппим rarity → вес
df["weight"] = df["rarity"].map(rarity_to_weight)
if df["weight"].isnull().any():
    bad = df[df["weight"].isnull()]["rarity"].unique()
    raise RuntimeError(f"❌ Неизвестные rarity в данных: {bad}")

# быстрый контроль
print("Первые 5 строк исходного пула:")
print(df.head().to_string(index=False))

# === 2) Функция расчёта EV без побочных эффектов ===
def compute_ev(subset: pd.DataFrame) -> float:
    w = subset["weight"]
    chances = w / w.sum()
    return float((chances * subset["floor_TON"]).sum())

# === 3) Жадно отсекаем «дорогие» ===
subset = df.copy()
ev = compute_ev(subset)
print(f"EV полного пула: {ev:.4f} TON (цель {TARGET_EV:.4f} TON)")

# пока EV выше цели — удаляем самый «вредный» элемент
while ev > TARGET_EV and len(subset) > 1:
    impact = subset["floor_TON"] / subset["weight"]
    idx = impact.idxmax()
    subset = subset.drop(index=idx)
    ev = compute_ev(subset)

# === 4) Результат ===
final_ids = subset["cs2_id"].tolist()
with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(final_ids, f, ensure_ascii=False, indent=2)

print(f"✅ Отобрано {len(final_ids)} предметов для HE = {100*(1-ev/OPEN_PRICE):.2f}%")
print(f"🏷 Итоговый EV: {ev:.4f} TON → HE = {100*(1-ev/OPEN_PRICE):.2f}%")
print(f"📋 Список ID сохранён в {OUTPUT_JSON}")
