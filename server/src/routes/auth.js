import { Router } from 'express';
import { signToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

const ADMIN_EMAIL = 'mitplay10@gmail.com';
const ADMIN_PASSWORD = 'mitgold';

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Informe email e senha' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (normalizedEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Email ou senha incorretos' });
  }

  const token = signToken({
    id: 'admin',
    email: ADMIN_EMAIL,
    name: 'Mit Play'
  });

  res.json({
    token,
    user: {
      id: 'admin',
      email: ADMIN_EMAIL,
      name: 'Mit Play'
    }
  });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', (_req, res) => {
  res.json({ ok: true });
});

export default router;
