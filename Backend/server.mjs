import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./Routes/auth.mjs";
import menuRoutes from "./Routes/menu.mjs";
import orderRoutes from "./Routes/orders.mjs";
import paymentRoutes from "./Routes/payments.mjs";
import webhookRoutes from "./Routes/webhook.mjs";
import errorHandler from "./Middlewares/errorHandler.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/* ======================
   MIDDLEWARES
====================== */

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://faith-grace-catering.vercel.app",
    "https://faith-and-grace-site.pages.dev",
    "https://www.graceefaith.com",
    "https://graceefaith.com",
  ],
  credentials: true,
}));

app.use(express.json());

/* ======================
   ROUTES
====================== */

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api/webhook", webhookRoutes);

app.use(errorHandler);

/* ======================
   DATABASE + SERVER START
====================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });

/* ======================
   SAFETY HANDLERS
====================== */

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});