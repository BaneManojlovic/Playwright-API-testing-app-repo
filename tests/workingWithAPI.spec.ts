import { test, expect } from '@playwright/test';
import tagsData from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
  // Mocking the API response for the GET request to /api/tags
  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
    await route.fulfill({ 
      body: JSON.stringify(tagsData), 
    });
  });

  await page.goto('https://conduit.bondaracademy.com/');
});

test('has title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
});
