import 'dotenv/config';

export const uploadToImgur = async (fileBuffer, mimeType) => {
  const base64 = fileBuffer.toString('base64');
  
  const res = await fetch('https://api.imgur.com/3/image', {
    method:  'POST',
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64,
      type:  'base64',
    }),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.data?.error || 'Imgur upload failed');
  return data.data.link;
};