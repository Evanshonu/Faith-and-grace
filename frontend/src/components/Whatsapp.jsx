import React from 'react';
import { CONTACT_LINKS } from '../config/site';

const WhatsApp = ({ order }) => {
  if (!order) return null;

  // Construct the pre-filled message
  const itemList = order.items
    .map((item) => `- ${item.name} x${item.quantity}`)
    .join('\n');

  const message = `Hello! I just placed an order.\n\nOrder ID: ${order._id}\nName: ${order.customerName}\nPhone: ${order.customerPhone}\nItems:\n${itemList}\nTotal: $${order.total.toFixed(2)}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `${CONTACT_LINKS.whatsapp}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-black tracking-wider"
      style={{
        background: 'linear-gradient(135deg,#25D366,#128C7E)',
        boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
      }}
    >
      WhatsApp <span>💬</span>
    </a>
  );
};

export default WhatsApp;
