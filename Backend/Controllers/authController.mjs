import 'dotenv/config';
import jwt          from 'jsonwebtoken';
import bcrypt       from 'bcryptjs';
import crypto       from 'crypto';
import nodemailer   from 'nodemailer';
import OwnerSettings from '../Models/OwnerSettings.mjs';

const resetTokens = new Map();

const makeTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ─── LOGIN ─────────────────────────────────────────────────────────── */
export const login = async (req, res) => {
  const { password } = req.body;

  if (!password)
    return res.status(400).json({ error: 'Password is required' });

  const setting = await OwnerSettings.findOne({ key: 'password_hash' });
  const hash    = setting?.value || process.env.OWNER_PASSWORD_HASH;

  const valid = await bcrypt.compare(password, hash);

  if (!valid)
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { role: 'owner' },
    process.env.JWT_SECRET,
    { expiresIn: '365d' }
  );

  res.json({ token });
};

/* ─── REQUEST PASSWORD RESET ─────────────────────────────────────────── */
export const requestPasswordReset = async (req, res) => {
  try {
    const token   = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 30;

    resetTokens.set(token, { expires });

    const resetLink = `${process.env.SITE_URL}/owner?reset=${token}`;

    await makeTransporter().sendMail({
      from:    `"Faith & Grace" <${process.env.EMAIL_USER}>`,
      to:      process.env.OWNER_EMAIL,
      subject: 'Password Reset — Faith & Grace Dashboard',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#1a0f0a;border-radius:16px;">
          <h2 style="color:#ff9a3c;margin:0 0 16px;">Password Reset</h2>
          <p style="color:#a89080;">Click the link below to reset your owner dashboard password. This link expires in 30 minutes.</p>
          <a href="${resetLink}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:linear-gradient(135deg,#c0392b,#e67e22);color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;">Reset Password</a>
          <p style="color:#6b5040;font-size:12px;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'Reset link sent to owner email' });
  } catch (err) {
    console.error('Reset email failed:', err.message);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
};

/* ─── CONFIRM PASSWORD RESET ─────────────────────────────────────────── */
export const confirmPasswordReset = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const record = resetTokens.get(token);
    if (!record || Date.now() > record.expires)
      return res.status(400).json({ error: 'Reset link is invalid or expired' });

    const hash = await bcrypt.hash(newPassword, 10);

    await OwnerSettings.findOneAndUpdate(
      { key: 'password_hash' },
      { value: hash },
      { upsert: true, returnDocument: 'after' }
    );

    process.env.OWNER_PASSWORD_HASH = hash;
    resetTokens.delete(token);

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset failed:', err);
    res.status(500).json({ error: 'Reset failed' });
  }
};