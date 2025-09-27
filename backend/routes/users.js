import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { listUsers, removeUser } from "../controllers/userController.js";

const router = express.Router();

// Only admin can access
router.get("/", authMiddleware(["admin"]), listUsers);
router.delete("/:id", authMiddleware(["admin"]), removeUser);

export default router;
