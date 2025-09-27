// import express from "express";
// import { authMiddleware } from "../middleware/auth.js";
// import { createTask, getTasks } from "../controllers/taskController.js"; // remove getTaskLogs

// const router = express.Router();

// // Routes
// router.post("/", authMiddleware(), createTask);
// router.get("/", authMiddleware(), getTasks);

// // Removed this line because getTaskLogs doesn't exist
// // router.get("/:id/logs", authMiddleware(), getTaskLogs);

// export default router;
import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { createTask, getTasks, editTask, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", authMiddleware(), createTask);
router.get("/", authMiddleware(), getTasks);
router.put("/:id", authMiddleware(), editTask);      // edit route
router.delete("/:id", authMiddleware(), deleteTask); // delete route

export default router;
