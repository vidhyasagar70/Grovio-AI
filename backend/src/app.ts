import cors from "cors";
import express from "express";
import noteRoutes from "./routes/noteRoutes";
import authRoutes from "./routes/authRoutes";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFound";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

const normalizeOrigin = (origin: string): string =>
  origin.endsWith("/") ? origin.slice(0, -1) : origin;

const allowedOrigins = env.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0)
  .map(normalizeOrigin);

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow non-browser/server-to-server requests with no Origin header.
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
      const isAllowed = allowedOrigins.includes(normalizedRequestOrigin);

      callback(null, isAllowed);
    },
  }),
);
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
