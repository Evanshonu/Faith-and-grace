import express      from 'express';
import cors         from 'cors';
import dotenv       from 'dotenv';
import connectDB    from './config/db.mjs';
import errorHandler from './Middlewares/errorHandler.mjs';
import authRoutes    from './Routes/auth.mjs';
import menuRoutes    from './Routes/menu.mjs';
import orderRoutes   from './Routes/orders.mjs';
import paymentRoutes from './Routes/payments.mjs';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 8000;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://faith-and-grace-site.pages.dev',
  'https://www.graceefaith.com',
  'https://graceefaith.com',
];

app.use(cors({
  origin:       ALLOWED_ORIGINS,
  methods:      ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials:  true,
}));

app.use(express.json({ limit: '10mb' })); // 10mb limit for base64 image uploads

app.use('/api/auth',   authRoutes);
app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api',        paymentRoutes);

app.get('/', (req, res) => res.send(`${process.env.RESTAURANT_NAME || 'Faith & Grace'} API running`));

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`KEY STARTS WITH: ${process.env.STRIPE_SECRET_KEY?.slice(0, 7)}`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

startServer();