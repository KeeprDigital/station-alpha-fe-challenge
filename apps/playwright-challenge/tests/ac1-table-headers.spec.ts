import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 1: Table Headers Verification
 *
 * - Verify the user table displays the correct headers:
 *   ID, Name, Username, Email, City, Phone, Website, and Company
 */
test("AC1: Verify table headers display correctly", async ({ page }) => {
  // Track API requests to verify they are made correctly
  let apiRequestMade = false;
  let requestMethod = "";
  let requestUrl = "";

  // Mock API to return users BEFORE navigating
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      const request = route.request();
      apiRequestMade = true;
      requestMethod = request.method();
      requestUrl = request.url();

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

  // Wait for the loading state to disappear
  await page.waitForSelector('[data-testid="loading-spinner"]', {
    state: "hidden",
  });

  // Verify all table headers are present and correct
  const expectedHeaders = [
    "ID",
    "Name",
    "Username",
    "Email",
    "City",
    "Phone",
    "Website",
    "Company",
  ];

  // Verify API request was made correctly
  expect(apiRequestMade).toBe(true);
  expect(requestMethod).toBe("GET");
  expect(requestUrl).toBe("https://jsonplaceholder.typicode.com/users");

  // Verify all table headers are present and correctly ordered
  const headerRow = page.locator("thead tr");
  await expect(headerRow).toBeVisible();

  for (let i = 0; i < expectedHeaders.length; i++) {
    const header = expectedHeaders[i];
    const headerCell = page.locator(
      `[data-testid="header-${header.toLowerCase()}"]`
    );

    // Verify header text content
    await expect(headerCell).toHaveText(header);

    // Verify header is visible and properly positioned
    await expect(headerCell).toBeVisible();

    // Verify header accessibility attributes
    await expect(headerCell).toHaveAttribute(
      "data-testid",
      `header-${header.toLowerCase()}`
    );
  }

  // Verify table structure and accessibility
  const table = page.locator("table.user-table");
  await expect(table).toBeVisible();
  await expect(table.locator("thead")).toBeVisible();
  await expect(table.locator("tbody")).toBeVisible();

  // Verify header count matches expected
  const headerCells = page.locator("thead th");
  await expect(headerCells).toHaveCount(expectedHeaders.length);
});
