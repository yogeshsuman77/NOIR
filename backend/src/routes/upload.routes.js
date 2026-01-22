import express from "express";
import authMiddleware from "../middlewares/auth.middlewares.js";
import { getUploadAuth } from "../services/imagekit.service.js";

const router = express.Router();

router.get("/auth", authMiddleware, getUploadAuth);

export default router;