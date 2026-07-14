import { test as setup } from '@playwright/test';
import user from '../.auth/user.json';
import fs from 'fs';

// File in whic we are going to save authenticated state
const authFile = '.auth/user.json';

setup('authentication', async ({ page, request }) => {
    /**
     * Temporary solution for authentication, since the login form is not working properly.
     * Commented out the code below, since we are going to use API request for authentication.
     */


    // Navigating to the application URL
    // await page.goto('https://conduit.bondaracademy.com/');

    // // Login to the application before each test
    // await page.getByText('Sign in').click();
    // await page.getByRole('textbox', { name: 'Email' }).fill('bane1manojlovic@gmail.com');
    // await page.getByRole('textbox', { name: 'Password' }).fill('Test123!');
    // await page.getByRole('button', { name: 'Sign in' }).click();

    // // Wait for fully loaded state of the app
    // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags');

    // // Saving the authenticated state to a file
    // await page.context().storageState({ path: authFile });


    // Using API request for authentication
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

    user.origins[0].localStorage[0].value = accessToken;
    // Write the updated user object to the auth file
    fs.writeFileSync(authFile, JSON.stringify(user));

    // Saving accessToken into process.env for later use in tests
    process.env.ACCESS_TOKEN = accessToken;
});