import express from "express";
import cors from "cors";
import caseRoutes from "./routes/case.routes.js";
import clueRoutes from "./routes/clue.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/auth.routes.js";
import connectionRoutes from "./routes/connection.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/clues", clueRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/uploads", uploadRoutes);

export default app;
