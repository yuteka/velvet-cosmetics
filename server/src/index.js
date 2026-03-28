import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import redisClient from './config/redis.js';
import sessionRoutes from './routes/session.js';
import cartRoutes from './routes/cart.js';
import profileRoutes from './routes/profile.js';
import emailRoutes from './routes/email.js';
import { apiLimiter, loginLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use('/api', apiLimiter); // 🛡️ All routes rate limit

// Health check
app.get('/', (req, res) => {
  res.json({ status: '✅ Velvet Backend Running!' });
});

// Routes
app.use('/api/session', sessionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});