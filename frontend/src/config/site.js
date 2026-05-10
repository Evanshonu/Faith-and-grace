export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CONTACT = {
  phoneDigits: '8622129328',
  phoneE164: '18622129328',
  phoneDisplay: '862-212-9328',
  phoneIntlDisplay: '+1 862-212-9328',
  email: 'gnigriel@yahoo.com',
};

export const CONTACT_LINKS = {
  phone: `tel:${CONTACT.phoneDigits}`,
  email: `mailto:${CONTACT.email}`,
  whatsapp: `https://wa.me/${CONTACT.phoneE164}`,
};

export const normalizeOrderStatus = (status) =>
  status === 'pending' ? 'paid' : status;
