import express from 'express';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { r2Client, r2Bucket } from '../config/r2.js';
import crypto from 'crypto';

const router = express.Router();

function randomKey(ext='') {
  return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
}

async function buildPresign({ contentType, extension = '' }) {
  if (!contentType) throw new Error('contentType required');
  const ext = extension
    ? (extension.startsWith('.') ? extension : `.${extension}`)
    : '';
  const key = randomKey(ext);

  const { url, fields } = await createPresignedPost(r2Client, {
    Bucket: r2Bucket,
    Key: key,
    Conditions: [
      ['starts-with', '$Content-Type', ''],
      ['content-length-range', 0, 10 * 1024 * 1024], // 10MB max
    ],
    Fields: { 'Content-Type': contentType },
    Expires: 60,
  });
  return { url, fields, key };
}

// Simple health check to avoid 404 when hitting /api/uploads
router.get('/', (_req, res) => res.json({ ok: true }));

// GET /api/uploads/presign?contentType=image/jpeg&extension=.jpg (for quick testing)
router.get('/presign', async (req, res) => {
  try {
    const { contentType, extension = '' } = req.query || {};
    if (!contentType) return res.status(400).json({ error: 'contentType required' });
    const data = await buildPresign({ contentType, extension });
    return res.json(data);
  } catch (err) {
    console.error('presign GET error', err);
    return res.status(500).json({ error: 'Failed to presign' });
  }
});

// POST /api/uploads/presign
// body: { contentType: string, extension?: string }
router.post('/presign', async (req, res) => {
  try {
    const { contentType, extension = '' } = req.body || {};
    if (!contentType) return res.status(400).json({ error: 'contentType required' });
    const data = await buildPresign({ contentType, extension });
    return res.json(data);
  } catch (err) {
    console.error('presign error', err);
    return res.status(500).json({ error: 'Failed to presign' });
  }
});

export default router;
