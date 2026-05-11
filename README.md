# Campus Notification System

## Project Structure
- **/logging_middleware**: Contains `logger.ts` for logging functionality.
- **/notification_app_fe**: Next.js frontend application.
- **/notification_app_be**: Backend placeholder.
- **priority_inbox.js**: Logic for Stage 1.
- **Notification_System_Design.md**: Explanation of system design.

## How to Run
1. Navigate to frontend: `cd notification_app_fe`
2. Install dependencies: `npm install`
3. Start server: `npm run dev`
4. Access: `http://localhost:3000`

## Implementation Notes
- Implemented `logging_middleware` to send events to the evaluation API.
- Logic is production-ready; browser network policies (CORS) may cause 'Failed to fetch' errors in local dev environments.