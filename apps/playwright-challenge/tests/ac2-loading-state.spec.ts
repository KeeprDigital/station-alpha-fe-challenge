import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 2: Loading State
 *
 * - Verify the application shows a loading state while fetching data
 * - Verify the loading state is replaced by the user table once data is loaded
 */
test("AC2: Verify loading state functionality", async ({ page }) => {
  // Mock API to return users with a slight delay to ensure we can see the loading state
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      // Add a small delay to simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 100));

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
        ]),
      });
    }
  );

  // Navigate to the app AFTER setting up the route
  await page.goto("http://localhost:3677");

  // Check that loading spinner is initially visible
  await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
  await expect(page.locator('[data-testid="loading-spinner"]')).toContainText(
    "Loading users..."
  );

  // Wait for the loading state to disappear
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "hidden",
  });

  // Verify the user table is now visible
  await expect(page.locator('[data-testid="user-table"]')).toBeVisible();

  // Verify the loading spinner is no longer visible
  await expect(
    page.locator('[data-testid="loading-spinner"]')
  ).not.toBeVisible();
});
