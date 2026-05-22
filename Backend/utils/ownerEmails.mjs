const normalizeEmails = (value) =>
  (value || '')
    .split(',')
    .map(email => email.trim())
    .filter(Boolean);

export const getOwnerEmails = () =>
  [...new Set(normalizeEmails(process.env.OWNER_EMAIL))];
