import puppeteer from 'puppeteer';

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error.message));

    console.log("Navigating to home...");
    await page.goto('http://localhost:5173/');

    console.log("Waiting for FAB...");
    await page.waitForTimeout(2000);

    // Click the FAB button to open chat
    console.log("Opening chat...");
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const fab = buttons.find(b => b.className.includes('fixed bottom-6'));
        if (fab) fab.click();
    });

    await page.waitForTimeout(1000);

    // Type a message
    console.log("Typing message...");
    await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input'));
        const chatInput = inputs.find(i => i.placeholder.includes('Ask about travel'));
        if (chatInput) {
            chatInput.value = "Hello world";
            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });

    await page.waitForTimeout(500);

    // Click send
    console.log("Clicking send...");
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const sendBtn = buttons.find(b => b.className.includes('bg-blue-600') && b.innerHTML.includes('lucide-send'));
        if (sendBtn) sendBtn.click();
    });

    console.log("Waiting 5 seconds for AI response and potential errors...");
    await page.waitForTimeout(5000);

    await browser.close();
    console.log("Done.");
})().catch(err => {
    console.error("Puppeteer script failed:", err);
    process.exit(1);
});
