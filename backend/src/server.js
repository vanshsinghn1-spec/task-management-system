require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Task Management API running on port ${PORT}`);
  console.log(`📡 Local API URL:  http://localhost:${PORT}/api/tasks`);
  console.log(`📚 Swagger Docs:   http://localhost:${PORT}/api-docs`);
  console.log(`===============================================`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down gracefully...", err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...", err);
  process.exit(1);
});
