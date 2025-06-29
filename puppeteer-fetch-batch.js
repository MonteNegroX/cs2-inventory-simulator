import puppeteer from "puppeteer";
import fs from "fs";

const urlsPath = process.argv[2];
if (!urlsPath) {
    console.error("❌ Укажи путь к JSON с targetUrls");
    process.exit(1);
}

const targetUrls = JSON.parse(fs.readFileSync(urlsPath, "utf-8"));

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();

    console.log("🌐 Загружаю https://marketapp.ws/?tab=fragment...");
    try {
        await page.goto("https://marketapp.ws/?tab=fragment", { waitUntil: "domcontentloaded", timeout: 60000 });
    } catch (e) {
        console.error("❌ Ошибка загрузки страницы:", e);
        await browser.close();
        process.exit(1);
    }
    console.log("✅ Страница загружена, начинаю парсинг...");

    const result = await page.evaluate((targetUrls) => {
        const rows = document.querySelectorAll('#main_container > main table tbody tr');
        const output = [];

        rows.forEach(row => {
            const linkElem = row.querySelector('td:nth-child(2) a');
            const floorElem = row.querySelector('td:nth-child(3) a div.table-cell-desc');

            if (linkElem && floorElem) {
                const href = linkElem.href;
                if (targetUrls.includes(href)) {
                    let floor_USD = floorElem.textContent.trim();
                    floor_USD = floor_USD.replace('~', '').trim();

                    output.push({
                        url: href,
                        floor_USD
                    });
                }
            }
        });

        return output;
    }, targetUrls);

    console.log("✅ Парсинг завершён, получено:", result.length);
    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
