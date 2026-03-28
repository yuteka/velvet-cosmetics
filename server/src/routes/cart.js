import express from 'express';
import redisClient from '../config/redis.js';

const router = express.Router();

// ✅ Cart Save
router.post('/save', async (req, res) => {
  const { userId, cartData } = req.body;
  if (!userId || !cartData) return res.status(400).json({ error: 'Missing data' });

  await redisClient.setEx(
    `cart:${userId}`,
    60 * 60 * 24, // 24 hours
    JSON.stringify(cartData)
  );

  res.json({ success: true, message: 'Cart saved!' });
});

// ✅ Cart Get
router.get('/get/:userId', async (req, res) => {
  const data = await redisClient.get(`cart:${req.params.userId}`);
  if (!data) return res.status(404).json({ error: 'Cart not found' });
  res.json({ success: true, data: JSON.parse(data) });
});

// ✅ Cart Clear
router.delete('/clear/:userId', async (req, res) => {
  await redisClient.del(`cart:${userId}`);
  res.json({ success: true, message: 'Cart cleared!' });
});

export default router;