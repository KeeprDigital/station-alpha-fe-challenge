import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 4: Empty State
 *
 * - Mock the API to return an empty array
 * - Verify the application displays a "No users found" message
 */
test("AC4: Verify empty state when no users found", async ({ page }) => {
  // Track API requests for verification
  let apiRequestMade = false;
  let responseStatus = 0;
  let responseData: any = null;

  // Mock API to return empty array BEFORE navigating
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      const request = route.request();
      apiRequestMade = true;

      // Verify request correctness
      expect(request.method()).toBe("GET");
      expect(request.url()).toBe("https://jsonplaceholder.typicode.com/users");

      const emptyResponse: any[] = [];
      responseData = emptyResponse;
      responseStatus = 200;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(emptyResponse),
      });
    }
  );

  // Navigate to the app AFTER setting up the route
  await page.goto("http://localhost:3677");

  // Wait for the loading state to disappear
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "hidden",
  });

  // Verify API request was made correctly
  expect(apiRequestMade).toBe(true);
  expect(responseStatus).toBe(200);
  expect(responseData).toEqual([]);

  // Verify the user table container is visible
  const userTableContainer = page.locator('[data-testid="user-table"]');
  await expect(userTableContainer).toBeVisible();

  // Verify the "No users found" message is displayed with proper styling
  const noUsersMessage = page.locator('[data-testid="no-users"]');
  await expect(noUsersMessage).toBeVisible();
  await expect(noUsersMessage).toHaveText("No users found.");
  await expect(noUsersMessage).toHaveAttribute("data-testid", "no-users");
  await expect(noUsersMessage).toHaveClass("no-data");

  // Verify that the actual table (with headers) is not present
  await expect(page.locator("table.user-table")).not.toBeVisible();

  // Verify no table headers are shown
  await expect(page.locator("thead")).not.toBeVisible();
  await expect(page.locator("tbody")).not.toBeVisible();

  // Verify no data rows exist
  await expect(page.locator("tbody tr")).toHaveCount(0);

  // Verify no error states are shown
  await expect(
    page.locator('[data-testid="error-modal-overlay"]')
  ).not.toBeVisible();

  // Verify the empty state is accessible
  await expect(noUsersMessage).toBeInViewport();

  // Verify page structure is still intact
  await expect(page.locator(".app-header h1")).toHaveText("User Directory");
  await expect(page.locator(".app-subtitle")).toHaveText(
    "View and manage your users"
  );

  // Verify loading spinner is completely gone
  await expect(
    page.locator('[data-testid="loading-spinner"]')
  ).not.toBeVisible();
});
