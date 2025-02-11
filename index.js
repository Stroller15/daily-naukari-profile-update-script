const puppeteer = require("puppeteer");
const path = require("path");

// Naukri credentials
const EMAIL = "PUT_YOUR_NAUKARI_PROFILE_EMAIL_HERE";
const PASSWORD = "PUT_YOUR_NAUKARI_PROFILE_PASSWORD_HERE";

// Path to your resume file
const RESUME_PATH = path.join(__dirname, "Shubham_Verma_SDE_2025.pdf");

// Helper function to delay execution
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function updateNaukriProfile() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
  });

  const page = await browser.newPage();

  try {
    // Set user agent to mimic real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    // Set viewport
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // Set longer default timeout
    page.setDefaultTimeout(90000);

    // Enable request interception to handle navigation issues
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (["image", "stylesheet", "font"].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    console.log("Navigating to login page...");
    await page.goto("https://www.naukri.com/nlogin/login", {
      waitUntil: "networkidle0",
      timeout: 90000,
    });

    // Add extra delay after initial page load
    await delay(5000);

    // Wait for login form with longer timeout
    console.log("Waiting for login form...");
    await page.waitForFunction(
      () => {
        const emailInput =
          document.querySelector("#usernameField") ||
          document.querySelector(
            'input[placeholder="Enter your active Email ID / Username"]'
          );
        const passwordInput =
          document.querySelector("#passwordField") ||
          document.querySelector('input[placeholder="Enter your password"]');
        return emailInput && passwordInput;
      },
      { timeout: 90000 }
    );

    // Type credentials with human-like delays
    console.log("Entering credentials...");
    await page.type(
      '#usernameField, input[placeholder="Enter your active Email ID / Username"]',
      EMAIL,
      { delay: 100 }
    );
    await delay(1000);
    await page.type(
      '#passwordField, input[placeholder="Enter your password"]',
      PASSWORD,
      { delay: 100 }
    );
    await delay(1000);

    // Click login button and handle navigation
    console.log("Attempting login...");
    await Promise.all([
      // Click the login button
      page.evaluate(() => {
        const loginButton =
          document.querySelector('button[type="submit"]') ||
          document.querySelector('button:contains("Login")');
        loginButton.click();
      }),
      // Wait for network to be idle
      page
        .waitForNavigation({ waitUntil: "networkidle0", timeout: 90000 })
        .catch(() => {}),
    ]);

    // Add delay after login attempt
    await delay(10000);

    // Verify login success by checking multiple indicators
    const isLoggedIn = await page.evaluate(() => {
      return !!(
        document.querySelector(".nI-gNb-drawer__bars") ||
        document.querySelector(".user-name") ||
        document.querySelector('[href*="logout"]') ||
        window.location.href.includes("my.naukri.com")
      );
    });

    if (!isLoggedIn) {
      throw new Error("Login verification failed");
    }

    console.log("Successfully logged in, navigating to profile...");
    await page.goto("https://www.naukri.com/mnjuser/profile", {
      waitUntil: "networkidle0",
      timeout: 90000,
    });

    await delay(5000);

    // Take screenshot for debugging
    await page.screenshot({ path: "profile_page.png", fullPage: true });

    // Wait for and find the resume update button with improved selector
    console.log("Looking for resume update button...");
    await page.waitForFunction(
      () => {
        const button =
          document.querySelector('input[type="button"].dummyUpload') ||
          document.querySelector('button:contains("UPDATE RESUME")');
        return button && button.offsetParent !== null;
      },
      { timeout: 90000 }
    );

    // Add delay before clicking
    await delay(2000);

    // Click the update button using JavaScript
    await page.evaluate(() => {
      const button =
        document.querySelector('input[type="button"].dummyUpload') ||
        document.querySelector('button:contains("UPDATE RESUME")');
      button.click();
    });

    // Handle file upload
    console.log("Attempting to upload resume...");
    const fileInput = await page.waitForSelector('input[type="file"]', {
      visible: true,
      timeout: 30000,
    });

    if (!fileInput) {
      throw new Error("File input not found");
    }

    await fileInput.uploadFile(RESUME_PATH);

    // Wait for upload completion with longer delay
    await delay(20000);

    console.log("Resume update completed successfully!");
  } catch (error) {
    console.error("Detailed error:", error);
    // Take error screenshot
    await page.screenshot({ path: "error_state.png", fullPage: true });
    throw error;
  } finally {
    await delay(5000);
    await browser.close();
  }
}

// Run the function
updateNaukriProfile().catch(console.error);
