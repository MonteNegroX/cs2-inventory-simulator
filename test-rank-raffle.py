# get_stickerdom_user_profile.py

import requests
import json

URL = "https://api.stickerdom.store/api/v1/user/6809652019/profile"

def main():
    try:
        response = requests.get(URL, timeout=10)
        response.raise_for_status()  # вызывает ошибку, если не 2xx

        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))  # красиво форматирует JSON
    except requests.RequestException as e:
        print(f"Ошибка запроса: {e}")
    except json.JSONDecodeError:
        print("Не удалось декодировать JSON из ответа.")

if __name__ == "__main__":
    main()
