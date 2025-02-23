import { chromium, Page, FullConfig } from '@playwright/test';
const { login } = require('./Utils/LoginHelper');
import * as fs from 'fs';
import  dotenv from 'dotenv';

// Read environment variables from file
dotenv.config(); 

const username = process.env.USER_EMAIL;
const password = process.env.PASSWORD;
const secretCode = process.env.MICROSOFT_TOTP_SECRET;

async function checkIfSessionExpired(page: Page) {
    const currentUrl = page.url();
    if (currentUrl.includes('login')) {
        console.log('Session has expired. Need to log in again.');
        return true;
    }
    else{  
        console.log('Session is still active.');
        return false;
    }
}

async function globalSetup(config: FullConfig) {
    const { baseURL, storageState, headless } = config.projects[0].use;
    // Launch a new browser instance
    const browser = await chromium.launch({headless : headless});
    const context = await browser.newContext({storageState: storageState});
    const page = await context.newPage();

    // Navigate to the login page
    await page.goto(baseURL as string);
    await page.waitForTimeout(3000);

    // Check if the user is already logged in (e.g., by looking for a logout button)

    if (await checkIfSessionExpired(page)) {

        await login(page, username, password, secretCode);

        // Wait for login to complete (e.g., wait for a specific element to appear)
        await page.waitForSelector('//button[@data-pc-section="root"]/span[@data-pc-section="icon"]');

        const currentUrl = await page.url();
        const isLoggedIn = currentUrl.includes('/menu');

        if (isLoggedIn){
            // Save the session storage to a file
            await context.storageState({ path: storageState as string });
        }
    }else{
        console.log('Using existing session.');
    }
 
  // Close the browser
  await browser.close();
}
 
export default globalSetup;