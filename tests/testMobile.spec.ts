import { test } from '@playwright/test';

test('title visible on mobile', async ({ page }) => {

    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText('conduit').isVisible();
});