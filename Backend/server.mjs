import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.mjs';
import errorHandler from './Middlewares/errorHandler.mjs';
import authRoutes from './Routes/auth.mjs';
import menuRoutes from './Routes/menu.mjs';
import orderRoutes from './Routes/orders.mjs';
import paymentRoutes from './Routes/payments.mjs';
import webhookRoutes from './Routes/webhook.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
    'http://localhost:8080',
  'https://faith-and-grace-site.pages.dev',
  'https://www.graceefaith.com',
  'https://graceefaith.com',
];
// Render/API URL : https://faith-and-grace.onrender.com

// Webhook requires raw body before JSON middleware
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) =>
  res.send(`${process.env.RESTAURANT_NAME || 'Faith & Grace'} API running`)
);

app.use(errorHandler);

// ------------------ SOCKET.IO SETUP ------------------
const startServer = async () => {
  await connectDB();

  // Wrap Express app with HTTP server
  const server = createServer(app);

  // Attach Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*", // can restrict to frontend URLs
      methods: ["GET", "POST"],
    },
  });

  // Save io in app locals to use inside routes/controllers
  app.set("io", io);

  // Log connections for kitchen display
  io.on("connection", (socket) => {
    console.log("Kitchen client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Kitchen client disconnected:", socket.id);
    });
  });

  server.listen(PORT, () =>
    console.log(`✅ Server running on http://localhost:${PORT}`)
  );
};

startServer();