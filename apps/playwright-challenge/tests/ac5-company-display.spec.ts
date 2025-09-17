import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 5: Company Display
 *
 * - Verify users with a company display the company name
 * - Verify users without a company display the cross SVG icon
 * - Validate the presence of the cross SVG icon by checking the data-testid="no-company-icon" attribute
 */
test("AC5: Verify company display with cross icon for users without company", async ({
  page,
}) => {
  // Mock API to return users with and without companies BEFORE navigating
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
            company: null, // User without company
          },
          {
            id: 3,
            name: "Bob Johnson",
            username: "bobjohnson",
            email: "bob@example.com",
            address: {
              street: "Pine St",
              suite: "Unit 789",
              city: "Chicago",
              zipcode: "60601",
              geo: {
                lat: "41.8781",
                lng: "-87.6298",
              },
            },
            phone: "555-456-7890",
            website: "bobjohnson.net",
            company: {
              name: "DEF Ltd",
              catchPhrase: "Excellence in service",
              bs: "reliable solutions",
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

  // Test user with company (ID: 1)
  await expect(
    page.locator('[data-testid="company-1"] .company-name')
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="company-1"] .company-name')
  ).toHaveText("ABC Corp");
  await expect(
    page.locator('[data-testid="company-1"] [data-testid="no-company-icon"]')
  ).not.toBeVisible();

  // Test user without company (ID: 2) - should show cross icon
  await expect(
    page.locator('[data-testid="company-2"] [data-testid="no-company-icon"]')
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="company-2"] .company-name')
  ).not.toBeVisible();

  // Verify the cross icon contains SVG elements
  const crossIcon = page.locator(
    '[data-testid="company-2"] [data-testid="no-company-icon"] svg'
  );
  await expect(crossIcon).toBeVisible();
  await expect(crossIcon).toHaveAttribute("viewBox", "0 0 24 24");

  // Test another user with company (ID: 3)
  await expect(
    page.locator('[data-testid="company-3"] .company-name')
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="company-3"] .company-name')
  ).toHaveText("DEF Ltd");
  await expect(
    page.locator('[data-testid="company-3"] [data-testid="no-company-icon"]')
  ).not.toBeVisible();
});
