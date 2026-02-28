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

connectDB();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://faith-grace-catering.vercel.app',
    'https://faith-and-grace-site.pages.dev',
    'https://www.graceefaith.com',
    'https://graceefaith.com',
  ],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',   authRoutes);
app.use('/api/menu',   menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api',        paymentRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));