// puppeteer-floor-server.js

import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3000;

app.get("/get-floor", async (req, res) => {
    const url = req.query.url;
    if (!url) {
        console.log("❌ URL не указан.");
        return res.status(400).json({ error: "URL не указан." });
    }

    console.log("🌐 Получен запрос:", url);

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();

        console.log("🚀 Загружаем страницу...");
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

        const selector = "#main_container > main > section.tm-section.clearfix.mb-2 > div.table-responsive > table > tbody > tr > td:nth-child(2) > div > div";

        console.log("🔍 Ждём появления элемента с floor price...");
        await page.waitForSelector(selector, { timeout: 30000 });

        const floorPrice = await page.$eval(selector, el =>
            el.textContent.trim().replace(/[^\d.]/g, "")
        );

        console.log("✅ Floor price найден:", floorPrice);
        res.json({ floor: floorPrice });

    } catch (error) {
        console.error("❌ Ошибка:", error);
        res.status(500).json({ error: "Ошибка при получении floor price." });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Puppeteer Floor API запущен: http://localhost:${PORT}/get-floor?url=...`);
});
