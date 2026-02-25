import { Router }   from 'express';
import jwt          from 'jsonwebtoken';
import bcrypt       from 'bcryptjs';
import dotenv       from 'dotenv';

dotenv.config();
const router = Router();

// One-time: hash your password and store in .env as OWNER_PASSWORD_HASH
// Run this once in node: bcrypt.hashSync('faithgrace2025', 10)

router.post('/login', async (req, res) => {
  const { password } = req.body;

  const valid = await bcrypt.compare(password, process.env.OWNER_PASSWORD_HASH);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { role: 'owner' },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({ token });
});

export default router;