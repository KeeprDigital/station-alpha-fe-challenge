import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 3: Display User Data
 *
 * - Mock the API to return a list of users
 * - Verify the table correctly displays user data in each column
 * - Verify links in the website column point to the correct URL
 */
test("AC3: Verify user data display and website links", async ({ page }) => {
  // Mock API to return test users BEFORE navigating
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: 1,
            name: "John Doe",
            username: "johndoe",
            email: "john@example.com",
            address: {
              street: "Main St",
              suite: "Apt 123",
              city: "New York",
              zipcode: "10001",
              geo: {
                lat: "40.7128",
                lng: "-74.0060",
              },
            },
            phone: "555-123-4567",
            website: "johndoe.com",
            company: {
              name: "ABC Corp",
              catchPhrase: "Making things happen",
              bs: "innovative solutions",
            },
          },
          {
            id: 2,
            name: "Jane Smith",
            username: "janesmith",
            email: "jane@example.com",
            address: {
              street: "Oak Ave",
              suite: "Suite 456",
              city: "Los Angeles",
              zipcode: "90210",
              geo: {
                lat: "34.0522",
                lng: "-118.2437",
              },
            },
            phone: "555-987-6543",
            website: "janesmith.org",
            company: {
              name: "XYZ Inc",
              catchPhrase: "Innovation at its best",
              bs: "cutting-edge technology",
            },
          },
        ]),
      });
    }
  );

  // Navigate to the app AFTER setting up the route
  await page.goto("http://localhost:3677");

  // Wait for the loading state to disappear
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "hidden",
  });

  // Verify user table is visible
  await expect(page.locator('[data-testid="user-table"]')).toBeVisible();

  // Verify first user data
  await expect(page.locator('[data-testid="id-1"]')).toHaveText("1");
  await expect(page.locator('[data-testid="name-1"]')).toHaveText("John Doe");
  await expect(page.locator('[data-testid="username-1"]')).toHaveText(
    "johndoe"
  );
  await expect(page.locator('[data-testid="email-1"]')).toHaveText(
    "john@example.com"
  );
  await expect(page.locator('[data-testid="city-1"]')).toHaveText("New York");
  await expect(page.locator('[data-testid="phone-1"]')).toHaveText(
    "555-123-4567"
  );
  await expect(
    page.locator('[data-testid="company-1"] .company-name')
  ).toHaveText("ABC Corp");

  // Verify second user data
  await expect(page.locator('[data-testid="id-2"]')).toHaveText("2");
  await expect(page.locator('[data-testid="name-2"]')).toHaveText("Jane Smith");
  await expect(page.locator('[data-testid="username-2"]')).toHaveText(
    "janesmith"
  );
  await expect(page.locator('[data-testid="email-2"]')).toHaveText(
    "jane@example.com"
  );
  await expect(page.locator('[data-testid="city-2"]')).toHaveText(
    "Los Angeles"
  );
  await expect(page.locator('[data-testid="phone-2"]')).toHaveText(
    "555-987-6543"
  );
  // Note: User ID 2 will have company set to null by the API service (even IDs get null company)
  await expect(
    page.locator('[data-testid="company-2"] [data-testid="no-company-icon"]')
  ).toBeVisible();

  // Verify website links are correct
  const johnWebsiteLink = page.locator('[data-testid="website-1"] a');
  await expect(johnWebsiteLink).toHaveText("johndoe.com");
  await expect(johnWebsiteLink).toHaveAttribute("href", "https://johndoe.com");
  await expect(johnWebsiteLink).toHaveAttribute("target", "_blank");

  const janeWebsiteLink = page.locator('[data-testid="website-2"] a');
  await expect(janeWebsiteLink).toHaveText("janesmith.org");
  await expect(janeWebsiteLink).toHaveAttribute(
    "href",
    "https://janesmith.org"
  );
  await expect(janeWebsiteLink).toHaveAttribute("target", "_blank");
});
