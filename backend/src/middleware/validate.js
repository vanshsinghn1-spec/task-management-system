const { z } = require("zod");
const { AppError } = require("./errorHandler");

const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(120, "Title must not exceed 120 characters"),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(1, "Description cannot be empty")
    .max(2000, "Description must not exceed 2000 characters"),
  status: z
    .enum(["pending", "in_progress", "completed"], {
      errorMap: () => ({ message: "Status must be pending, in_progress, or completed" })
    })
    .default("pending"),
  priority: z
    .enum(["low", "medium", "high"], {
      errorMap: () => ({ message: "Priority must be low, medium, or high" })
    })
    .default("medium"),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      return !isNaN(Date.parse(val));
    }, { message: "Invalid dueDate format. Use YYYY-MM-DD or ISO 8601 string." })
});

const updateTaskSchema = createTaskSchema.partial().refine((data) => {
  return Object.keys(data).length > 0;
}, { message: "At least one field must be provided for update" });

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message
        }));
        return next(new AppError("Validation failed", 400, formattedErrors));
      }
      next(err);
    }
  };
};

module.exports = {
  validate,
  createTaskSchema,
  updateTaskSchema
};
