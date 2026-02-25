const login = async (req, res) => {
  const { password } = req.body;

  if (!password)
    return res.status(400).json({ error: 'Password is required' });

  const valid = await bcrypt.compare(password, process.env.OWNER_PASSWORD_HASH);

  if (!valid)
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { role: 'owner' },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({ token });
};