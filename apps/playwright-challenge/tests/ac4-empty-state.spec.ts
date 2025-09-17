import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 4: Empty State
 *
 * - Mock the API to return an empty array
 * - Verify the application displays a "No users found" message
 */
test("AC4: Verify empty state when no users found", async ({ page }) => {
  // Mock API to return empty array BEFORE navigating
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      });
    }
  );

  // Navigate to the app AFTER setting up the route
  await page.goto("http://localhost:3677");

  // Wait for the loading state to disappear
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "hidden",
  });

  // Verify the user table container is visible
  await expect(page.locator('[data-testid="user-table"]')).toBeVisible();

  // Verify the "No users found" message is displayed
  await expect(page.locator('[data-testid="no-users"]')).toBeVisible();
  await expect(page.locator('[data-testid="no-users"]')).toHaveText(
    "No users found."
  );

  // Verify that the actual table (with headers) is not present
  await expect(page.locator("table.user-table")).not.toBeVisible();
});
