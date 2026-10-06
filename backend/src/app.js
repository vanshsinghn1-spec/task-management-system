const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const taskRoutes = require("./routes/task.routes");
const { swaggerJsDoc } = require("./config/swagger");
const { errorHandler, AppError } = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Task Management API Docs"
}));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Task API Routes
app.use("/api/tasks", taskRoutes);

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
