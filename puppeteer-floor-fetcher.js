// puppeteer-floor-fetcher.js

import puppeteer from "puppeteer";

const url = process.argv[2];
if (!url) {
    console.error("❌ Укажи URL в команде:\nnode puppeteer-floor-fetcher.js <url>");
    process.exit(1);
}

(async () => {
    const browser = await puppeteer.launch({
        headless: "new", // Chromium без UI
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    console.log("🌐 Загружаем страницу:", url);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const selector = "#main_container > main > section.tm-section.clearfix.mb-2 > div.table-responsive > table > tbody > tr > td:nth-child(2) > div > div";

    console.log("🔍 Ожидание появления элемента с floor price...");
    await page.waitForSelector(selector, { timeout: 30000 });

    const floorPrice = await page.$eval(selector, el =>
        el.textContent.trim().replace(/[^\d.]/g, "")
    );

    console.log("✅ Floor price найден:", floorPrice);

    await browser.close();
})();
