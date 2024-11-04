
const puppeteer = require('puppeteer');
const fs = require('fs');
const crypto = require('crypto');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    

    const url = 'https://www.pascalcoste-shopping.com/esthetique/fond-de-teint.html';
    await page.goto(url, { waitUntil: 'networkidle2' });
    

    const screenshotPath = './left_banner_screenshot.png';


    const bannerElement = await page.$('.left-side-banner-selector'); // replace with the actual selector
    if (bannerElement) {
        await bannerElement.screenshot({ path: screenshotPath });
    } else {
        console.error('Left side banner not found on the page.');
        await browser.close();
        return;
    }


    const adDetails = await page.evaluate(() => {
        const adElement = document.querySelector('.left-side-banner-selector'); // replace with actual selector
        return {
            redirection_url: adElement ? adElement.href : null,
            img_link: adElement ? adElement.querySelector('img').src : null
        };
    });

    if (adDetails.redirection_url && adDetails.img_link) {
        // Generate unique identifier (MD5 hash of URL)
        const id = crypto.createHash('md5').update(adDetails.redirection_url).digest('hex');
        

        const adData = {
            id,
            redirection_url: adDetails.redirection_url,
            img_link: adDetails.img_link,
            image_url: screenshotPath,
            format: "Left Side Banner"
        };

        fs.writeFileSync('./ad_details.json', JSON.stringify(adData, null, 2));
        console.log("Advertisement details saved successfully.");
    } else {
        console.error('Failed to extract ad details.');
    }

    await browser.close();
})();
