// puppeteer-floor-fetcher.js

import puppeteer from "puppeteer";

const url = process.argv[2];
if (!url) {
    console.error("❌ Укажи URL в команде:\nnode puppeteer-floor-fetcher.js <url>");
    process.exit(1);
}

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

        const selector = "#main_container > main > section.tm-section.clearfix.mb-2 > div.table-responsive > table > tbody > tr > td:nth-child(2) > div > div";

        await page.waitForSelector(selector, { timeout: 30000 });

        const floorPrice = await page.$eval(selector, el =>
            el.textContent.trim().replace(/[^\d.]/g, "")
        );

        console.log(floorPrice); // только floor price для парсера
    } catch (e) {
        console.log(""); // если не найден, выводим пустую строку
    } finally {
        await browser.close();
    }
})();
