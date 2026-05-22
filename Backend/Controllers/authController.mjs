import 'dotenv/config';
import jwt          from 'jsonwebtoken';
import bcrypt       from 'bcryptjs';
import crypto       from 'crypto';
import { Resend }  from 'resend';
import OwnerSettings from '../Models/OwnerSettings.mjs';
import { getOwnerEmails } from '../utils/ownerEmails.mjs';

const resend      = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL  = process.env.EMAIL_FROM || 'Faith & Grace <onboarding@resend.dev>';

const getEmailErrorMessage = (error) => {
  if (!error) return 'Unknown email error';
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  return JSON.stringify(error);
};

const sendEmail = async (payload) => {
  const { error } = await resend.emails.send(payload);

  if (error) {
    throw new Error(getEmailErrorMessage(error));
  }
};

const getOwnerPasswordHash = async () => {
  const setting = await OwnerSettings.findOne({ key: 'password_hash' });
  return setting?.value || process.env.OWNER_PASSWORD_HASH || '';
};

const buildResetReference = (hash) =>
  crypto.createHash('sha256').update(hash).digest('hex').slice(0, 16);

/* ─── LOGIN ─────────────────────────────────────────────────────────── */
export const login = async (req, res) => {
  const { password } = req.body;

  if (!password)
    return res.status(400).json({ error: 'Password is required' });

  const hash = await getOwnerPasswordHash();

  if (!hash)
    return res.status(500).json({ error: 'Owner password is not configured' });

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
    const hash = await getOwnerPasswordHash();
    if (!hash)
      return res.status(500).json({ error: 'Owner password is not configured' });

    const token = jwt.sign(
      {
        type: 'owner_password_reset',
        ref: buildResetReference(hash),
      },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    const resetLink = `${process.env.SITE_URL}/owner?reset=${token}`;
    const ownerEmails = getOwnerEmails();

    if (ownerEmails.length === 0)
      return res.status(500).json({ error: 'Owner email is not configured' });

    await sendEmail({
      from:    FROM_EMAIL,
      to:      ownerEmails,
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

    if (!token || !newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'A valid token and password are required' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'owner_password_reset')
      return res.status(400).json({ error: 'Reset link is invalid or expired' });

    const currentHash = await getOwnerPasswordHash();
    if (!currentHash || payload.ref !== buildResetReference(currentHash))
      return res.status(400).json({ error: 'Reset link is invalid or expired' });

    const hash = await bcrypt.hash(newPassword, 10);

    await OwnerSettings.findOneAndUpdate(
      { key: 'password_hash' },
      { value: hash },
      { upsert: true, returnDocument: 'after' }
    );

    process.env.OWNER_PASSWORD_HASH = hash;

    res.json({ message: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset failed:', err.message);
    res.status(400).json({ error: 'Reset link is invalid or expired' });
  }
};
