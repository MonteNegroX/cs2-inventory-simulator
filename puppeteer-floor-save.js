import puppeteer from "puppeteer";
import fs from "fs";
import { URL } from "url";

// Указывай здесь или передавай через аргумент, если нужно
const url = "https://marketapp.ws/collection/EQCE80Aln8YfldnQLwWMvOfloLGgmPY0eGDJz9ufG3gRui3D";
const jsonFile = "floors.json";

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    console.log("🌐 Загружаем страницу...");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const selector = "#main_container > main > section.tm-section.clearfix.mb-2 > div.table-responsive > table > tbody > tr > td:nth-child(2) > div > div";

    console.log("🔍 Ждём появления элемента...");
    await page.waitForSelector(selector, { timeout: 30000 });

    const floorPrice = await page.$eval(selector, el =>
        el.textContent.trim().replace(/[^\d.]/g, "")
    );

    console.log("✅ Floor price:", floorPrice);

    // Извлекаем ID коллекции из URL
    let collectionId = null;
    try {
        const u = new URL(url);
        const segments = u.pathname.split("/");
        collectionId = segments[segments.length - 1];
    } catch (e) {
        console.log("⚠️ Не удалось извлечь ID из URL.");
    }

    const entry = {
        time: new Date().toISOString(),
        floor: floorPrice,
        url: url,
        collectionId: collectionId
    };

    let data = [];
    if (fs.existsSync(jsonFile)) {
        const existing = fs.readFileSync(jsonFile, "utf8");
        try {
            data = JSON.parse(existing);
        } catch (e) {
            console.error("⚠️ Ошибка парсинга существующего JSON, перезапись...");
        }
    }

    data.push(entry);
    fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));

    console.log(`✅ Запись добавлена в ${jsonFile}:`, entry);

    await browser.close();
})();
