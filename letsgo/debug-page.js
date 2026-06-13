import puppeteer from 'puppeteer';

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
    page.on('requestfailed', request => console.error('REQUEST FAILED:', request.url(), request.failure()?.errorText));

    console.log("Navigating to My Trips...");
    await page.goto('http://localhost:5173/my-trips', { waitUntil: 'networkidle2' });

    console.log("Waiting a few seconds for any runtime errors...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    await browser.close();
    console.log("Done.");
})().catch(err => {
    console.error("Puppeteer script failed:", err);
    process.exit(1);
});
