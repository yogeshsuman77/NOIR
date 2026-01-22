import express from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { createClue, getCluesByCase, updateClue } from "../controllers/clue.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createClue);
router.get("/case/:caseId", authMiddleware, getCluesByCase);
router.put("/:id", authMiddleware, updateClue);

export default router;