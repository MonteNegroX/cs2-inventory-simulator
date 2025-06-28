// server.js

import express from "express";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const app = express();
const PORT = 3000;

app.get("/get-floor", async (req, res) => {
    const url = req.query.url;
    if (!url) {
        console.log("❌ URL не указан");
        return res.status(400).json({ error: "URL не указан" });
    }

    console.log("✅ Запрос получен:", url);

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            console.log("⏰ Таймаут запроса (10 секунд)");
            controller.abort();
        }, 10000);

        console.log("🌐 Отправляем fetch...");
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        clearTimeout(timeout);
        console.log("✅ Ответ получен, статус:", response.status);

        const html = await response.text();
        console.log("📄 HTML получен, длина:", html.length);

        const dom = new JSDOM(html);
        const document = dom.window.document;

        console.log("🔍 Ищем элемент с floor price...");

        const el = document.querySelector(
            "#main_container > main > section.tm-section.clearfix.mb-2 > div.table-responsive > table > tbody > tr > td:nth-child(2) > div > div"
        );

        if (el) {
            const rawText = el.textContent.trim();
            const floor = rawText.replace(/[^\d.]/g, "");
            console.log("✅ Floor найден:", floor);
            res.json({ floor });
        } else {
            console.log("⚠️ Элемент не найден в HTML.");
            res.json({ error: "Floor price не найден." });
        }
    } catch (error) {
        console.error("❌ Ошибка:", error);
        res.status(500).json({ error: "Ошибка при загрузке или парсинге." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
