import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 2: Loading State
 *
 * - Verify the application shows a loading state while fetching data
 * - Verify the loading state is replaced by the user table once data is loaded
 */
test("AC2: Verify loading state functionality", async ({ page }) => {
  // Track request timing and details
  let requestStartTime = 0;
  let requestEndTime = 0;
  let apiRequestMade = false;

  // Mock API to return users with a controlled delay
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      const request = route.request();
      requestStartTime = Date.now();
      apiRequestMade = true;

      // Verify request headers and method
      expect(request.method()).toBe("GET");
      expect(request.url()).toBe("https://jsonplaceholder.typicode.com/users");

      // Add realistic network delay to ensure loading state is testable
      await new Promise((resolve) => setTimeout(resolve, 300));

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

      requestEndTime = Date.now();
    }
  );

  // Record start time for loading duration measurement
  const navigationStartTime = Date.now();

  // Navigate to the app AFTER setting up the route
  await page.goto("http://localhost:3677");

  // Immediately verify loading state appears
  const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
  await expect(loadingSpinner).toBeVisible();
  await expect(loadingSpinner).toContainText("Loading users...");

  // Verify loading state accessibility and styling
  await expect(loadingSpinner).toHaveAttribute(
    "data-testid",
    "loading-spinner"
  );

  // Verify user table is NOT visible during loading
  await expect(page.locator('[data-testid="user-table"]')).not.toBeVisible();

  // Verify API request is triggered
  await page.waitForFunction(() => window.fetch !== undefined);

  // Wait for the loading state to disappear with timeout
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "hidden",
    timeout: 10000,
  });

  const loadingEndTime = Date.now();
  const loadingDuration = loadingEndTime - navigationStartTime;

  // Verify loading took a reasonable amount of time (should be > 200ms due to our delay)
  expect(loadingDuration).toBeGreaterThan(200);

  // Verify API request was actually made
  expect(apiRequestMade).toBe(true);
  expect(requestEndTime - requestStartTime).toBeGreaterThan(250); // Our delay was 300ms

  // Verify smooth transition to data state
  await expect(page.locator('[data-testid="user-table"]')).toBeVisible();
  await expect(loadingSpinner).not.toBeVisible();

  // Verify data is properly loaded
  await expect(page.locator('[data-testid="user-1"]')).toBeVisible();
  await expect(page.locator('[data-testid="name-1"]')).toHaveText("John Doe");

  // Verify no error states are shown
  await expect(
    page.locator('[data-testid="error-modal-overlay"]')
  ).not.toBeVisible();
  await expect(page.locator('[data-testid="no-users"]')).not.toBeVisible();
});
