import cors from "cors";
import express from "express";
import noteRoutes from "./routes/noteRoutes";
import authRoutes from "./routes/authRoutes";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: "ok" },
  });
});

// Public auth routes (no authorization required)
app.use("/auth", authRoutes);

// Protected note routes (authorization required)
app.use("/notes", authMiddleware, noteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
