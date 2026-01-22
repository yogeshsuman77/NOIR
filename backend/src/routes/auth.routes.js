import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import authUser from '../middlewares/auth.middlewares.js'

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authUser, (req, res) => { res.status(200).json({ message: "User Verified" }) });

export default router;