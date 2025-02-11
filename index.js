const puppeteer = require("puppeteer");
const path = require("path");

// Naukri credentials
const EMAIL = "shubhamverma6351@gmail.com";
const PASSWORD = "8gKreNFU!!ReTgA";

// Path to your resume file
const RESUME_PATH = path.join(__dirname, "Shubham_Verma_SDE.pdf");

// Helper function to delay execution
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function updateNaukriProfile() {
  const browser = await puppeteer.launch({
    headless: false, // Changed to false for better debugging
    args: ["--start-maximized", "--disable-notifications"],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  try {
    // Set longer default timeout
    page.setDefaultTimeout(60000);

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
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Wait for either email input or alternate login form
    console.log("Waiting for login form...");
    await Promise.race([
      page.waitForSelector("#usernameField", { visible: true }),
      page.waitForSelector(
        'input[placeholder="Enter your active Email ID / Username"]',
        { visible: true }
      ),
    ]);

    // Find the correct input fields
    const emailInput =
      (await page.$("#usernameField")) ||
      (await page.$(
        'input[placeholder="Enter your active Email ID / Username"]'
      ));
    const passwordInput =
      (await page.$("#passwordField")) ||
      (await page.$('input[placeholder="Enter your password"]'));

    if (!emailInput || !passwordInput) {
      throw new Error("Could not find login form fields");
    }

    // Login to Naukri
    console.log("Attempting login...");
    await emailInput.type(EMAIL, { delay: 100 });
    await passwordInput.type(PASSWORD, { delay: 100 });

    // Find and click the login button
    const loginButton =
      (await page.$('button[type="submit"]')) ||
      (await page.$('button:has-text("Login")'));
    if (!loginButton) {
      throw new Error("Login button not found");
    }

    await loginButton.click();

    // Wait for navigation after login
    await Promise.race([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
      page.waitForSelector(".nI-gNb-drawer__bars", {
        visible: true,
        timeout: 60000,
      }),
    ]);

    console.log("Navigating to profile page...");
    await page.goto("https://www.naukri.com/mnjuser/profile", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Take screenshot for debugging
    await page.screenshot({ path: "profile_page.png", fullPage: true });

    // Wait for and find the resume update button
    console.log("Looking for resume update button...");
    const updateResumeButton = await Promise.race([
      page.waitForSelector('input[type="button"].dummyUpload', {
        visible: true,
        timeout: 60000,
      }),
      page.waitForSelector('button:has-text("UPDATE RESUME")', {
        visible: true,
        timeout: 60000,
      }),
    ]);

    if (!updateResumeButton) {
      throw new Error("Update Resume button not found");
    }

    // Scroll to button and click
    await updateResumeButton.evaluate((button) => {
      button.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    await delay(2000);
    await updateResumeButton.click();

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
    await delay(10000); // Longer delay for upload completion

    console.log("Resume update completed successfully!");
  } catch (error) {
    console.error("Detailed error:", error);
    // Take error screenshot
    await page.screenshot({ path: "error_state.png", fullPage: true });
  } finally {
    await delay(5000); // Give time to see the final state
    await browser.close();
  }
}

// Run the function
updateNaukriProfile();
