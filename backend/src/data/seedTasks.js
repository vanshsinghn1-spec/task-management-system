/**
 * Initial seed data for in-memory Task Store
 */
const seedTasks = [
  {
    id: "task-001",
    title: "Implement Authentication Module",
    description: "Design and implement JWT-based authentication flow with refresh tokens and session recovery.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-15",
    createdAt: "2026-10-01T09:30:00.000Z",
    updatedAt: "2026-10-02T14:15:00.000Z"
  },
  {
    id: "task-002",
    title: "Configure Tailwind & Aceternity UI Components",
    description: "Setup dark mode palette, Card Spotlight effects, and custom border gradients for the dashboard.",
    status: "completed",
    priority: "medium",
    dueDate: "2026-10-08",
    createdAt: "2026-10-02T11:00:00.000Z",
    updatedAt: "2026-10-04T16:20:00.000Z"
  },
  {
    id: "task-003",
    title: "Refactor REST API Error Handling Middleware",
    description: "Centralize express error formatting and ensure standard RFC 7807 compliant JSON error structures.",
    status: "pending",
    priority: "high",
    dueDate: "2026-10-12",
    createdAt: "2026-10-03T08:00:00.000Z",
    updatedAt: "2026-10-03T08:00:00.000Z"
  },
  {
    id: "task-004",
    title: "Write Swagger OpenAPI Documentation",
    description: "Document all endpoints, query parameters, request schemas, and responses for external consumers.",
    status: "completed",
    priority: "low",
    dueDate: "2026-10-09",
    createdAt: "2026-10-03T10:45:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z"
  },
  {
    id: "task-005",
    title: "Optimize Search Debounce and Filter State",
    description: "Implement 300ms debounce on the search input to minimize query churn and smooth out UI transitions.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-10-18",
    createdAt: "2026-10-04T13:20:00.000Z",
    updatedAt: "2026-10-06T10:10:00.000Z"
  },
  {
    id: "task-006",
    title: "Mobile Responsiveness & Drawer Testing",
    description: "Verify touch gestures, slide-out drawer behavior on mobile viewports, and table horizontal scroll.",
    status: "pending",
    priority: "low",
    dueDate: "2026-10-22",
    createdAt: "2026-10-05T15:00:00.000Z",
    updatedAt: "2026-10-05T15:00:00.000Z"
  }
];

module.exports = { seedTasks };
