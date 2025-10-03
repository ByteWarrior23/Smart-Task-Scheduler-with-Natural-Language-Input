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
  SearchTasks
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

export default router;


