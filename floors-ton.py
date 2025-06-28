import json
import requests

# Загружаем floors.json
with open("floors.json", "r", encoding="utf-8") as f:
    data = json.load(f)

try:
    # Получаем курс TON → USD с Binance API
    url = "https://api.binance.com/api/v3/ticker/price?symbol=TONUSDT"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    ton_usd_price = float(response.json()["price"])
    print(f"✅ Курс TON с Binance: {ton_usd_price} USD")

    # Пересчет floor -> floorTon
    if isinstance(data, list):
        for item in data:
            floor_usd = float(item["floor"])
            floor_ton = floor_usd / ton_usd_price
            item["floorTon"] = f"{floor_ton:.2f}"
    else:
        floor_usd = float(data["floor"])
        floor_ton = floor_usd / ton_usd_price
        data["floorTon"] = f"{floor_ton:.2f}"

    # Сохраняем
    with open("floors-ton.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Сохранено в floors-ton.json с курсом TON {ton_usd_price} USD")

except requests.exceptions.RequestException as e:
    print(f"❌ Ошибка запроса к Binance: {e}")

except Exception as e:
    print(f"❌ Ошибка обработки: {e}")
