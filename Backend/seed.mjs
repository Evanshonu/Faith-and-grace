import mongoose from 'mongoose';
import dotenv   from 'dotenv';
import MenuItem from './Models/MenuItem.mjs';

dotenv.config();

const menuItems = [
  { name: 'Jollof Rice',     price: 12.99, category: 'Rice Dishes', desc: 'Smoky tomato-based rice slow-cooked with spices.',        image: '/images/jollof.jpg',           available: true },
  { name: 'Waakye',          price: 11.99, category: 'Rice Dishes', desc: 'Hearty Ghanaian rice & beans with rich stew.',            image: '/images/waakye.jpg',           available: true },
  { name: 'Fried Rice',      price: 12.99, category: 'Rice Dishes', desc: 'Golden stir-fried rice with vegetables and seasoning.',   image: '/images/friedrice.webp',       available: true },
  { name: 'Fufu',            price: 13.99, category: 'Swallows',    desc: 'Pounded cassava & yam in fragrant light soup.',           image: '/images/fufu.jpg',             available: true },
  { name: 'Banku & Tilapia', price: 15.99, category: 'Swallows',    desc: 'Fermented corn dumplings with grilled tilapia.',          image: '/images/bankuandtilapia.webp', available: true },
  { name: 'Fried Fish',      price: 10.99, category: 'Proteins',    desc: 'Crispy golden fried fish with West African spices.',      image: '/images/friedfish.jpg',        available: true },
  { name: 'Pepper Sauce',    price: 3.99,  category: 'Sides',       desc: 'Fiery house-made Ghanaian pepper sauce.',                 image: '/images/peppersauce.jpg',      available: true },
  { name: 'Bofrot',          price: 6.99,  category: 'Sweets',      desc: 'Pillowy Ghanaian fried doughnuts dusted in sugar.',       image: '/images/bofrot.jpg',           available: true },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await MenuItem.deleteMany();
  await MenuItem.insertMany(menuItems);
  console.log('Menu seeded successfully');
  process.exit();
};

seed();