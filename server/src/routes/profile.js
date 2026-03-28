import express from 'express';
import redisClient from '../config/redis.js';

const router = express.Router();

// ✅ Profile Cache Save
router.post('/save', async (req, res) => {
  const { userId, profileData } = req.body;
  if (!userId || !profileData) return res.status(400).json({ error: 'Missing data' });

  await redisClient.setEx(
    `profile:${userId}`,
    60 * 60, // 1 hour
    JSON.stringify(profileData)
  );

  res.json({ success: true, message: 'Profile cached!' });
});

// ✅ Profile Cache Get
router.get('/get/:userId', async (req, res) => {
  const data = await redisClient.get(`profile:${req.params.userId}`);
  if (!data) return res.status(404).json({ error: 'Profile cache not found' });
  res.json({ success: true, data: JSON.parse(data) });
});

// ✅ Profile Cache Clear
router.delete('/clear/:userId', async (req, res) => {
  await redisClient.del(`profile:${req.params.userId}`);
  res.json({ success: true, message: 'Profile cache cleared!' });
});

export default router;