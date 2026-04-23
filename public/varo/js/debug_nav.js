const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

        await page.goto('http://localhost:5500/public/varo/index.html', { waitUntil: 'networkidle0' });

        const navHTML = await page.$eval('#varoCategoryNav', el => el.outerHTML).catch(e => 'NAV_NOT_FOUND');
        console.log('NAV_HTML_LENGTH:', navHTML.length);
        if (navHTML === 'NAV_NOT_FOUND') console.log('NAV_HTML:', navHTML);

        const navStyles = await page.$eval('#varoCategoryNav', el => window.getComputedStyle(el).display).catch(e => 'NO_NAV');
        console.log('NAV_DISPLAY:', navStyles);

        await page.screenshot({ path: 'C:/Users/admin/Desktop/HAYUL/eclipse/ShoppingMall/public/varo/debug_nav.png' });
        console.log('Screenshot saved');

        await browser.close();
    } catch (e) {
        console.error(e);
    }
})();
