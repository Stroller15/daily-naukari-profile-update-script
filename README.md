# Daily Naukri Profile Update Script

This repository contains a Node.js script that automates the process of updating your resume on Naukri.com using Puppeteer. The script logs into your Naukri account, navigates to the profile page, and uploads a new resume file. It is designed to be run daily using a cron job (or equivalent scheduler) on Windows, Linux, or macOS.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Puppeteer](https://pptr.dev/) (will be installed via `npm install`)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/daily-naukari-profile-update-script.git
   cd daily-naukari-profile-update-script
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up your credentials and resume path:**

   Open the `index.js` file and update the following variables with your Naukri credentials and the path to your resume file:

   ```javascript
   // Naukri credentials
   const EMAIL = "PUT_YOUR_NAUKARI_PROFILE_EMAIL_HERE";
   const PASSWORD = "PUT_YOUR_NAUKARI_PROFILE_PASSWORD_HERE";

   // Path to your resume file
   const RESUME_PATH = path.join(__dirname, "Shubham_Verma_SDE_2025.pdf");
   ```

   Replace `PUT_YOUR_NAUKARI_PROFILE_EMAIL_HERE` and `PUT_YOUR_NAUKARI_PROFILE_PASSWORD_HERE` with your actual Naukri login credentials. Also, replace `Shubham_Verma_SDE_2025.pdf` with the name of your resume file.

---

## Usage

To run the script manually, use the following command:

```bash
node index.js
```

This will execute the script, log into your Naukri account, and update your resume.

---

## Automating with Cron Jobs (Linux/macOS) or Task Scheduler (Windows)

To automate the script to run daily, follow the instructions below based on your operating system.

### **For Linux/macOS:**

1. **Make the script executable:**

   ```bash
   chmod +x index.js
   ```

2. **Open the crontab editor:**

   ```bash
   crontab -e
   ```

3. **Add a new cron job:**

   For example, to run the script every day at 8 AM, add the following line:

   ```bash
   0 8 * * * /usr/bin/node /path/to/daily-naukari-profile-update-script/index.js >> /path/to/daily-naukari-profile-update-script/logfile.log 2>&1
   ```

   - Replace `/usr/bin/node` with the path to your Node.js executable (you can find it by running `which node`).
   - Replace `/path/to/daily-naukari-profile-update-script` with the actual path to your project directory.

4. **Save and exit the crontab editor.**

---

### **For Windows:**

1. **Open Task Scheduler:**

   - Press `Win + S`, type "Task Scheduler," and open it.

2. **Create a new task:**

   - Click on "Create Basic Task" in the right-hand panel.
   - Name the task (e.g., "Daily Naukri Profile Update") and click "Next."

3. **Set the trigger:**

   - Choose "Daily" and click "Next."
   - Set the time to 8:00 AM (or your preferred time) and click "Next."

4. **Set the action:**

   - Choose "Start a Program" and click "Next."
   - In the "Program/script" field, enter the path to `node.exe` (e.g., `C:\Program Files\nodejs\node.exe`).
   - In the "Add arguments" field, enter the path to the `index.js` file (e.g., `C:\path\to\daily-naukari-profile-update-script\index.js`).
   - In the "Start in" field, enter the path to the project directory (e.g., `C:\path\to\daily-naukari-profile-update-script`).

5. **Finish the setup:**

   - Click "Next" and then "Finish."

6. **Logging:**

   - To log the output, modify the script to write logs to a file (already implemented in the script).

---

## Logging

The script logs its output to `logfile.log` in the project directory. You can check this file for any errors or to verify that the script is running as expected.

---

## Platform-Specific Notes

- **Linux/macOS:** Ensure Puppeteer has all the required dependencies installed. Run the following command if you encounter issues:

  ```bash
  sudo apt-get install -y libgbm-dev libxshmfence-dev
  ```

- **Windows:** Puppeteer should work out of the box, but ensure your system has the latest updates and required Visual C++ redistributables.

- **macOS:** If you encounter issues with Puppeteer, ensure Xcode command-line tools are installed:

  ```bash
  xcode-select --install
  ```

---

## Troubleshooting

- **Login Issues:** Ensure that your Naukri credentials are correct and that your account is not locked due to multiple failed login attempts.
- **File Upload Issues:** Make sure the resume file path is correct and the file is accessible.
- **Puppeteer Issues:** If the script fails to run, try running it in non-headless mode by setting `headless: false` in the `puppeteer.launch` options. This will allow you to see the browser actions and debug any issues.
