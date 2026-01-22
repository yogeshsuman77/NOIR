import express from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { createConnection, getConnectionsByCase, updateConnection, deleteConnection } from "../controllers/connection.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createConnection);
router.get("/case/:caseId", authMiddleware, getConnectionsByCase);
router.put("/:id", authMiddleware, updateConnection);
router.delete("/:id", authMiddleware, deleteConnection);

export default router;