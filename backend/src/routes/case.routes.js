import express from "express";
import { createCase, getAllCases, getBoardData, getCaseById, saveBoard } from "../controllers/case.controller.js";
import authUser from "../middlewares/auth.middlewares.js"

const router = express.Router();

router.post("/", authUser, createCase);
router.get("/", authUser, getAllCases);
router.get("/:id", authUser, getCaseById);
router.get("/:id/board", authUser, getBoardData);
router.post('/:caseId/save', authUser, saveBoard)

export default router;