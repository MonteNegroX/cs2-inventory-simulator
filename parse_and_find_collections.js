// Updated batch Marketapp parser with detailed logging for each collection processed.

import fs from 'fs';
import csv from 'csv-parser';
import puppeteer from 'puppeteer';

const BATCH_SIZE = 10;

async function parseCSV(filePath, processedCollections) {
    return new Promise((resolve, reject) => {
        const collections = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (!row.character || row.character.trim() === '') {
                    if (row.Collection && row.Collection.trim() !== '') {
                        const collectionName = row.Collection.trim();
                        if (!processedCollections.includes(collectionName)) {
                            collections.push(collectionName);
                        }
                    }
                }
            })
            .on('end', () => {
                console.log(`✅ Найдено ${collections.length} новых коллекций для обработки.`);
                resolve([...new Set(collections)]);
            })
            .on('error', reject);
    });
}

async function scrapeMarketappTable() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`🌐 Загружаю https://marketapp.ws/?tab=fragment ...`);
    await page.goto('https://marketapp.ws/?tab=fragment', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('table', { timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log(`🔍 Сканирую таблицу коллекций...`);

    const data = await page.evaluate(() => {
        const rows = document.querySelectorAll('#main_container > main > section:nth-child(5) table tbody tr');
        const result = [];

        rows.forEach(row => {
            const linkElem = row.querySelector('td:nth-child(2) > a');
            const nameElem = row.querySelector('td:nth-child(2) > a > div.table-cell-value > div');
            if (linkElem && nameElem) {
                const name = nameElem.textContent.trim();
                const link = linkElem.href;
                result.push({ name, link });
            }
        });

        return result;
    });

    await browser.close();
    console.log(`✅ Собрано ${data.length} коллекций с Marketapp.`);

    return data;
}

async function main() {
    const csvPath = 'cs2stickers.csv';
    const progressFile = 'processed_collections.json';
    const outputFile = 'collections_links.json';

    let processedCollections = [];
    if (fs.existsSync(progressFile)) {
        processedCollections = JSON.parse(fs.readFileSync(progressFile));
    }

    if (!fs.existsSync(csvPath)) {
        console.error(`❌ CSV файл не найден по пути: ${csvPath}`);
        process.exit(1);
    }

    const collections = await parseCSV(csvPath, processedCollections);
    const batch = collections.slice(0, BATCH_SIZE);

    console.log(`🚀 Обрабатываю следующие ${batch.length} коллекций:`);
    batch.forEach((col, idx) => console.log(`${idx + 1}. ${col}`));

    if (batch.length === 0) {
        console.log('🎉 Все коллекции уже обработаны.');
        return;
    }

    const marketappData = await scrapeMarketappTable();

    let output = [];
    if (fs.existsSync(outputFile)) {
        output = JSON.parse(fs.readFileSync(outputFile));
    }

    batch.forEach(col => {
        const found = marketappData.find(item => item.name.toLowerCase().includes(col.toLowerCase()));
        if (found) {
            console.log(`✅ ${col} -> ${found.link}`);
        } else {
            console.log(`❌ ${col} -> not found`);
        }
        output.push({ Collection: col, link: found ? found.link : 'not found' });
        processedCollections.push(col);
    });

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    fs.writeFileSync(progressFile, JSON.stringify(processedCollections, null, 2));

    console.log(`✅ Добавлено ${batch.length} коллекций в ${outputFile}`);
    console.log(`💾 Прогресс сохранён в ${progressFile}`);
}

main();
