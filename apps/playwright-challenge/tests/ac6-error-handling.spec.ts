import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 6: Error Handling
 *
 * - Mock the API to return an error response
 * - Verify the error modal appears with the correct error message
 * - Verify the user can dismiss the modal
 */
test("AC6: Verify error modal functionality", async ({ page }) => {
  // Mock API to return an error response BEFORE navigating
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    }
  );

  // Navigate to the app AFTER setting up the route
  await page.goto("http://localhost:3677");

  // Wait for the loading state to disappear
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "hidden",
  });

  // Verify the error modal appears
  await expect(
    page.locator('[data-testid="error-modal-overlay"]')
  ).toBeVisible();
  await expect(page.locator('[data-testid="error-modal"]')).toBeVisible();

  // Verify the error message is correct
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  await expect(page.locator('[data-testid="error-message"]')).toHaveText(
    "Failed to load users. Please try again later."
  );

  // Verify the modal has proper structure
  await expect(page.locator('[data-testid="error-modal"] h3')).toHaveText(
    "Error"
  );
  await expect(
    page.locator('[data-testid="error-close-button"]')
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="error-action-button"]')
  ).toBeVisible();
  await expect(page.locator('[data-testid="error-action-button"]')).toHaveText(
    "Dismiss"
  );

  // Test dismissing the modal using the close button (X)
  await page.locator('[data-testid="error-close-button"]').click();

  // Verify the modal is dismissed
  await expect(
    page.locator('[data-testid="error-modal-overlay"]')
  ).not.toBeVisible();
  await expect(page.locator('[data-testid="error-modal"]')).not.toBeVisible();
});

test("AC6: Verify error modal can be dismissed with action button", async ({
  page,
}) => {
  // Mock API to return an error response BEFORE navigating
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "Not Found" }),
      });
    }
  );

  // Navigate to the app AFTER setting up the route
  await page.goto("http://localhost:3677");

  // Wait for the loading state to disappear
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "hidden",
  });

  // Verify the error modal appears
  await expect(
    page.locator('[data-testid="error-modal-overlay"]')
  ).toBeVisible();

  // Test dismissing the modal using the action button
  await page.locator('[data-testid="error-action-button"]').click();

  // Verify the modal is dismissed
  await expect(
    page.locator('[data-testid="error-modal-overlay"]')
  ).not.toBeVisible();
  await expect(page.locator('[data-testid="error-modal"]')).not.toBeVisible();
});
