# Aurora HRMS - Premium Workspace Dashboard

A complete, production-ready, premium frontend for a Human Resource Management System (HRMS) built using React 19, Vite, TypeScript, and Tailwind CSS. The interface is inspired by state-of-the-art designs from Vercel, Stripe, Linear, Apple, and Notion.

## Tech Stack
*   **Core:** React 19, Vite, TypeScript, React Router 7
*   **Styling:** Tailwind CSS, Custom HSL themes (Light & Dark modes)
*   **Animations:** Framer Motion (for smooth layout transfers, page transitions, and sliding tab highlights)
*   **Charting:** Recharts (providing Headcount Growth, Department Staff distribution, weekly Attendance trends, and Leave categorizations)
*   **Icons:** Lucide React

---

## Key Modules & Visual Flows

### 1. Authentication Portal
*   **Sign-In:** Role login selectors for demo testing (pre-populates credentials for Admin/Employee), remember-me checkbox, and password visibility toggle.
*   **Request Account:** Signup form featuring a real-time visual Password Strength Indicator (weak, fair, good, strong states).
*   **Recover Password & OTP Verification:** OTP entering grid with auto-focus shifting (navigating forward/backward on keystroke/backspace) and countdown timer.

### 2. Admin & HR Operations
*   **Dashboard Analytics:** Count-Up metrics (Total Staff, Present, Absent, Pending Leaves, Monthly Cost loads), department budget metrics, and charts.
*   **Leave Approvals Card:** Inline review modal allowing admins to add review comments and immediately Approve or Reject employee leaves.
*   **Employee Directory:** Seamless Table or Grid view selector, department pills filtering, search logs, and pagination helper. Includes an onboard form.

### 3. Employee Self-Service (ESS)
*   **Attendance Tracker:** Visual card with an interactive running shift clock timer tracking elapsed shift time, progress status bars, and Check-in/out actions.
*   **Absence Center:** Available leave category cards with used/total progress indicators, and an interactive "Request Leave" dialog form.
*   **Payslip Logs:** Compensation summaries, net yield cards, and an interactive Printable Payslip modal with simulated PDF download triggers.

### 4. Settings Panel
*   **Personal details form:** Edit and save username and email.
*   **Theme preset grid:** Large card selectors to switch between Light Mode and Dark Mode.
*   **Security & Notifications:** Password change controls and alert configuration toggles.

---

## Local Setup & Run

### Prerequisites
*   Node.js installed on your machine. (Pre-configured Node v22 binaries are present under `.gemini/antigravity-ide/scratch/node/node-v22.12.0-win-x64/` in the IDE environment).

### Run Instructions
Open your terminal in the project directory and run the following commands:

```bash
# Install package dependencies
npm install

# Start Vite development server
npm run dev
```

*Note: Since the `git` executable was not found on this system, Git initialization was skipped, but standard `.gitignore` and structure formats are prepared for instant source control integration when Git is installed.*
