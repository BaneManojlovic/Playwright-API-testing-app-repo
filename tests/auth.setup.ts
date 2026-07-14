import { test as setup } from '@playwright/test';

// File in whic we are going to save authenticated state
const authFile = '.auth/user.json';

setup('authentication', async ({ page }) => {
    // Navigating to the application URL
    await page.goto('https://conduit.bondaracademy.com/');

    // Login to the application before each test
    await page.getByText('Sign in').click();
    await page.getByRole('textbox', { name: 'Email' }).fill('bane1manojlovic@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Test123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for fully loaded state of the app
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags');

    // Saving the authenticated state to a file
    await page.context().storageState({ path: authFile });
});