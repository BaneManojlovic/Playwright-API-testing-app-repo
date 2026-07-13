import { test, expect } from '@playwright/test';
import tagsData from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
  // Mocking the API response for the GET request to /api/tags
  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
    await route.fulfill({ 
      body: JSON.stringify(tagsData), 
    });
  });

  // Modifing API response for the GET request to /api/articles?limit=10&offset=0
  await page.route('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', async route => {
      const response = await route.fetch()
      const responseBody = await response.json();
      // Taking properties that we want to modify
      responseBody.articles[0].title = 'Modified Title';
      responseBody.articles[0].description = 'Modified Description';
      // Finishing the request with modified response
      await route.fulfill({
        body: JSON.stringify(responseBody),
      });

  });


  await page.goto('https://conduit.bondaracademy.com/');
});

test('has title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  // Check that the mocked tags are displayed on the page
  await expect(page.locator('app-article-list h1').first()).toContainText('Modified Title');
  await expect(page.locator('app-article-list p').first()).toContainText('Modified Description');
});
