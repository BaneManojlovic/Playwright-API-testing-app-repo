import { test, expect, request } from '@playwright/test';
import tagsData from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
  // Mocking the API response for the GET request to /api/tags
  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
    await route.fulfill({ 
      body: JSON.stringify(tagsData), 
    });
  });

 

  await page.goto('https://conduit.bondaracademy.com/');


// Login to the application before each test
  await page.getByText('Sign in').click();
  await page.getByRole('textbox', { name: 'Email' }).fill('bane1manojlovic@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Test123!');
  await page.getByRole('button', { name: 'Sign in' }).click();  

});

test('has title', async ({ page }) => {
 // Modifing API response for the GET request to /api/articles?limit=10&offset=0
  await page.route('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', async route => {
      const response = await route.fetch()
      const responseBody = await response.json();
      // Taking properties that we want to modify
      responseBody.articles[0].title = 'This is a Mock test title';
      responseBody.articles[0].description = 'This is a Mock test description';
      // Finishing the request with modified response
      await route.fulfill({
        body: JSON.stringify(responseBody),
      });

  });

  // Needed for refreshing of web page after clicking on Global Feed link, otherwise the test will fail
  await page.getByText('Global Feed').click();

  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  // Check that the mocked tags are displayed on the page
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a Mock test title');
  await expect(page.locator('app-article-list p').first()).toContainText('This is a Mock test description');
});

test('delete article', async ({ page, request }) => {
  // Login to get the token for deleting the article           
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      user: {
        email: 'bane1manojlovic@gmail.com',
        password: 'Test123!'
      }
    }
  });
  const responseBody = await response.json();
  console.log('Response Body:', responseBody); // Log the response body to see its structure
  const accessToken = responseBody.user.token;

  // Publish article to delete it later
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    data: {
      article: {
        title: 'This is a test title',
        description: 'This is a test description',
        body: 'This is a test body',
        tagList: []
      }
    },
    headers: {
      Authorization: `Token ${accessToken}`
    }
  });
  expect(articleResponse.status()).toEqual(201);

  // Naviagitng to the page where the article is displayed and deleting it
  await page.getByText('Global Feed').click();
  await page.getByText('This is a test title').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  await page.getByText('Global Feed').click();  

  // Verify that the article is deleted by checking that it no longer appears in the list
  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test title');
});