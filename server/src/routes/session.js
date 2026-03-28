import express from 'express';
import redisClient from '../config/redis.js';

const router = express.Router();

// ✅ Session Save
router.post('/save', async (req, res) => {
  const { userId, userData } = req.body;
  if (!userId || !userData) return res.status(400).json({ error: 'Missing data' });

  await redisClient.setEx(
    `session:${userId}`,
    60 * 60 * 24 * 7, // 7 days
    JSON.stringify(userData)
  );

  res.json({ success: true, message: 'Session saved!' });
});

// ✅ Session Get
router.get('/get/:userId', async (req, res) => {
  const data = await redisClient.get(`session:${req.params.userId}`);
  if (!data) return res.status(404).json({ error: 'Session not found' });
  res.json({ success: true, data: JSON.parse(data) });
});

// ✅ Session Delete
router.delete('/delete/:userId', async (req, res) => {
  await redisClient.del(`session:${req.params.userId}`);
  res.json({ success: true, message: 'Session deleted!' });
});

export default router;