const items = [
  {
    name: 'Jollof Rice', category: 'Rice Dishes', price: 12.99,
    desc: 'Smoky tomato-based rice slow-cooked with spices.',
    image: '/images/jollof.jpg', available: true,
    sizes: [
      { label: 'Small',       quantity: 250,  unit: 'g',  price: 9.99  },
      { label: 'Medium',      quantity: 500,  unit: 'g',  price: 12.99 },
      { label: 'Large',       quantity: 750,  unit: 'g',  price: 15.99 },
      { label: 'Extra Large', quantity: 1000, unit: 'g',  price: 18.99 },
    ],
  },
  {
    name: 'Waakye', category: 'Rice Dishes', price: 11.99,
    desc: 'Hearty Ghanaian rice & beans with rich stew.',
    image: '/images/waakye.jpg', available: true,
    sizes: [
      { label: 'Small',  quantity: 250, unit: 'g', price: 8.99  },
      { label: 'Medium', quantity: 500, unit: 'g', price: 11.99 },
      { label: 'Large',  quantity: 750, unit: 'g', price: 14.99 },
    ],
  },
  {
    name: 'Fried Rice', category: 'Rice Dishes', price: 12.99,
    desc: 'Golden stir-fried rice with vegetables and seasoning.',
    image: '/images/friedrice.webp', available: true,
    sizes: [
      { label: 'Small',  quantity: 250, unit: 'g', price: 9.99  },
      { label: 'Medium', quantity: 500, unit: 'g', price: 12.99 },
      { label: 'Large',  quantity: 750, unit: 'g', price: 15.99 },
    ],
  },
  {
    name: 'Fufu', category: 'Swallows', price: 13.99,
    desc: 'Velvety pounded cassava & yam in fragrant light soup.',
    image: '/images/fufu.jpg', available: true,
    sizes: [
      { label: 'Small',  quantity: 300, unit: 'g', price: 10.99 },
      { label: 'Medium', quantity: 500, unit: 'g', price: 13.99 },
      { label: 'Large',  quantity: 800, unit: 'g', price: 17.99 },
    ],
  },
  {
    name: 'Banku & Tilapia', category: 'Swallows', price: 15.99,
    desc: 'Fermented corn dumplings with grilled tilapia.',
    image: '/images/bankuandtilapia.webp', available: true,
    sizes: [
      { label: 'Small',  quantity: 1, unit: 'pc', price: 12.99 },
      { label: 'Medium', quantity: 2, unit: 'pc', price: 15.99 },
      { label: 'Large',  quantity: 3, unit: 'pc', price: 20.99 },
    ],
  },
  {
    name: 'Fried Fish', category: 'Proteins', price: 10.99,
    desc: 'Crispy golden fried fish with West African spices.',
    image: '/images/friedfish.jpg', available: true,
    sizes: [
      { label: 'Small',  quantity: 1, unit: 'pc', price: 7.99  },
      { label: 'Medium', quantity: 2, unit: 'pc', price: 10.99 },
      { label: 'Large',  quantity: 3, unit: 'pc', price: 14.99 },
    ],
  },
  {
    name: 'Pepper Sauce', category: 'Sides', price: 3.99,
    desc: 'Fiery house-made Ghanaian pepper sauce.',
    image: '/images/peppersauce.jpg', available: true,
    sizes: [
      { label: 'Small',  quantity: 100, unit: 'ml', price: 2.99 },
      { label: 'Medium', quantity: 250, unit: 'ml', price: 3.99 },
      { label: 'Large',  quantity: 500, unit: 'ml', price: 5.99 },
    ],
  },
  {
    name: 'Bofrot', category: 'Sweets', price: 6.99,
    desc: 'Pillowy Ghanaian fried doughnuts dusted in sugar.',
    image: '/images/bofrot.jpg', available: true,
    sizes: [
      { label: 'Small',  quantity: 3,  unit: 'pc', price: 3.99 },
      { label: 'Medium', quantity: 6,  unit: 'pc', price: 6.99 },
      { label: 'Large',  quantity: 12, unit: 'pc', price: 11.99 },
    ],
  },
];