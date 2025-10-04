import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  archiveTask,
  unarchiveTask,
  markTaskAsCompleted,
  markTaskAsPending,
  addComment,
  getComments,
  SearchTasks,
  parseNaturalLanguage,
  createRecurringTask,
  updateRecurringTask,
  deleteRecurringTask,
  getRecurringTasks,
  getRecurringTaskInstances,
  getReminderStats,
  scheduleReminder,
  checkDeadlines,
  sendWelcomeEmailToUser
} from "../controllers/task.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/search", SearchTasks);
router.get("/:taskId", getTaskById);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.post("/:taskId/archive", archiveTask);
router.post("/:taskId/unarchive", unarchiveTask);
router.post("/:taskId/complete", markTaskAsCompleted);
router.post("/:taskId/pending", markTaskAsPending);
router.post("/:taskId/comments", addComment);
router.get("/:taskId/comments", getComments);
router.post("/nlp/parse", parseNaturalLanguage);

// Recurring task routes
router.post("/recurring", createRecurringTask);
router.get("/recurring", getRecurringTasks);
router.get("/recurring/:taskId/instances", getRecurringTaskInstances);
router.put("/recurring/:taskId", updateRecurringTask);
router.delete("/recurring/:taskId", deleteRecurringTask);

// Reminder routes
router.get("/reminders/stats", getReminderStats);
router.post("/:taskId/reminder", scheduleReminder);
router.post("/reminders/check", checkDeadlines);
router.post("/welcome-email", sendWelcomeEmailToUser);

export default router;


