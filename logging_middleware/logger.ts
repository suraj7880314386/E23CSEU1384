// logging_middleware/logger.ts

// IMPORTANT: Replace this with your actual access_token generated from the auth API
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlMjNjc2V1MTM4NEBiZW5uZXR0LmVkdS5pbiIsImV4cCI6MTc3ODQ4MzU4NCwiaWF0IjoxNzc4NDgyNjg0LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNzc5MzgzYjEtMTQ4Ni00MWRkLWE2ODgtOThhM2FlYTkzZjIxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3VyYWogc2luZ2giLCJzdWIiOiI2YTAwYzMxNC0wZThmLTQ2YmQtYWY5Zi0zMGNmNGM5ZDk2ZWIifSwiZW1haWwiOiJlMjNjc2V1MTM4NEBiZW5uZXR0LmVkdS5pbiIsIm5hbWUiOiJzdXJhaiBzaW5naCIsInJvbGxObyI6ImUyM2NzZXUxMzg0IiwiYWNjZXNzQ29kZSI6IlRmRHhnciIsImNsaWVudElEIjoiNmEwMGMzMTQtMGU4Zi00NmJkLWFmOWYtMzBjZjRjOWQ5NmViIiwiY2xpZW50U2VjcmV0IjoidWdtY2dQc3pwekJiZVhnUyJ9.dv602nrqOCgq5IJZGheyI6VNCB1OcW6EqNjZn1AgH2o"; 
const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

type LogLevel = "info" | "warn" | "error" | "debug" | "fatal";
type Stack = "frontend" | "backend";
type Package = 
  | "api" | "component" | "hook" | "page" | "state" | "style" 
  | "auth" | "config" | "middleware" | "utils";

async function sendToLogServer(stack: Stack, level: LogLevel, pkg: Package, message: string) {
  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });
  } catch (error) {
    console.error("Failed to send log to server:", error);
  }
}

export const Log = (stack: Stack, level: LogLevel, pkg: Package, message: string) => {
  // Console mein bhi print karenge development ke liye
  const logEntry = { stack, level, package: pkg, message, timestamp: new Date().toISOString() };
  console.log(`[${level.toUpperCase()}]`, message, logEntry);

  // Server par send karenge
  sendToLogServer(stack, level, pkg, message);
};