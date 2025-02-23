import { Page } from '@playwright/test';
 
/**
* Captures console logs from a given page and returns them after a timeout.
* @param page Playwright Page object
* @param timeout Time in milliseconds to wait for logs before returning
* @returns Promise that resolves with captured logs
*/
export async function waitForConsoleMessages(page: Page, timeout: number): Promise<string> {
    let accessTokenFromConsole: string = "";
    return new Promise((resolve) => {
        // Listen for console messages and store them
        page.on('console', (msg) => {
          let tempText = msg.text();
          if(tempText.includes("session.user.azureToken")){
            accessTokenFromConsole = tempText.split(" ")[1];
          }
        });
 
        // Resolve after the timeout with collected logs
        setTimeout(() => {
            console.log('✅ Returning collected logs after timeout:', accessTokenFromConsole);
            resolve(accessTokenFromConsole);
        }, timeout);
    });
}