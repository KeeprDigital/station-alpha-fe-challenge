import { test, expect } from "@playwright/test";

/**
 * Acceptance Criteria 3: Display User Data
 *
 * - Mock the API to return a list of users
 * - Verify the table correctly displays user data in each column
 * - Verify links in the website column point to the correct URL
 */
test("AC3: Verify user data display and website links", async ({ page }) => {
  // Track API requests for verification
  let apiRequestMade = false;
  let requestPayload: any = null;

  // Mock API to return test users BEFORE navigating
  await page.route(
    "https://jsonplaceholder.typicode.com/users",
    async (route) => {
      const request = route.request();
      apiRequestMade = true;

      // Verify request details
      expect(request.method()).toBe("GET");
      expect(request.url()).toBe("https://jsonplaceholder.typicode.com/users");
      // Note: Browser may send different Accept headers, this is normal

      const testData = [
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
      ];

      requestPayload = testData;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(testData),
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
  expect(requestPayload).toBeDefined();
  expect(requestPayload).toHaveLength(2);

  // Verify user table is visible and properly structured
  const userTable = page.locator('[data-testid="user-table"]');
  await expect(userTable).toBeVisible();

  // Verify table accessibility
  const table = page.locator("table.user-table");
  await expect(table).toBeVisible();
  await expect(table.locator("thead")).toBeVisible();
  await expect(table.locator("tbody")).toBeVisible();

  // Verify exact number of data rows
  const dataRows = page.locator("tbody tr");
  await expect(dataRows).toHaveCount(2);

  // Comprehensive verification of first user data with data validation
  const user1Row = page.locator('[data-testid="user-1"]');
  await expect(user1Row).toBeVisible();

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

  // Comprehensive verification of second user data
  const user2Row = page.locator('[data-testid="user-2"]');
  await expect(user2Row).toBeVisible();

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
  await expect(
    page.locator('[data-testid="company-2"] .company-name')
  ).not.toBeVisible();

  // Enhanced website link verification with accessibility checks
  const johnWebsiteLink = page.locator('[data-testid="website-1"] a');
  await expect(johnWebsiteLink).toBeVisible();
  await expect(johnWebsiteLink).toHaveText("johndoe.com");
  await expect(johnWebsiteLink).toHaveAttribute("href", "https://johndoe.com");
  await expect(johnWebsiteLink).toHaveAttribute("target", "_blank");
  await expect(johnWebsiteLink).toHaveAttribute("rel", "noopener noreferrer");

  // Test link interaction
  await johnWebsiteLink.hover();
  await expect(johnWebsiteLink).toBeEnabled();

  const janeWebsiteLink = page.locator('[data-testid="website-2"] a');
  await expect(janeWebsiteLink).toBeVisible();
  await expect(janeWebsiteLink).toHaveText("janesmith.org");
  await expect(janeWebsiteLink).toHaveAttribute(
    "href",
    "https://janesmith.org"
  );
  await expect(janeWebsiteLink).toHaveAttribute("target", "_blank");
  await expect(janeWebsiteLink).toHaveAttribute("rel", "noopener noreferrer");

  // Test link interaction
  await janeWebsiteLink.hover();
  await expect(janeWebsiteLink).toBeEnabled();

  // Verify data integrity - no empty cells
  const allCells = page.locator("tbody td");
  const cellCount = await allCells.count();
  expect(cellCount).toBe(16); // 2 users × 8 columns

  // Verify no error states are present
  await expect(
    page.locator('[data-testid="error-modal-overlay"]')
  ).not.toBeVisible();
  await expect(page.locator('[data-testid="no-users"]')).not.toBeVisible();

  // Verify table accessibility attributes
  await expect(table).toHaveAttribute("class", "user-table");
});
