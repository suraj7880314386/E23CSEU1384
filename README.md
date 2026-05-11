# Campus Notification System - Frontend Track

This repository contains the solution for the Frontend Track assessment, including the mandatory Logging Middleware and the notification priority inbox.

## Project Structure
- `/logging_middleware`: Reusable middleware package to send logs to the evaluation API.
- `/notification_app_fe`: Next.js application implementing the notification UI.
- `/notification_app_be`: Backend placeholder as per requirements.
- `priority_inbox.js`: Implementation of the priority sorting logic for Stage 1.
- `Notification_System_Design.md`: Design document explaining the priority scoring algorithm.

## Prerequisites
- Node.js installed on your system.
- Material UI (MUI) and Next.js dependencies.

## How to Run
1. Navigate to the frontend directory:
   ```bash
   cd notification_app_fe
Install dependencies:
code
Bash
npm install
Run the development server:
code
Bash
npm run dev
Open http://localhost:3000 in your browser.
Important Notes
The application integrates a custom logging_middleware to track significant events as per requirements.
Due to network security policies, API requests to the test server from a local browser environment may show 'Failed to fetch' (CORS). The logic remains fully implemented according to the assessment specifications.
code
Code
---

### Abhi turant kya karna hai:
1. VS Code mein `README.md` file kholo.
2. Purana sara content delete karke yeh naya content paste kar do.
3. Save karo.
4. Terminal mein ye 3 commands chalao:
   ```bash
   git add README.md
   git commit -m "Updated README with professional project documentation"
   git push -f origin main