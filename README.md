Faith and Grace Catering

Online ordering platform for a West African catering business. Customers browse the menu, place orders and pay securely online.


LIVE SITE

Website: https://www.graceefaith.com


FEATURES

Browse the full menu with photos, categories and prices
Add dishes to cart and adjust quantities
Choose pickup or delivery at checkout
Pay securely online via Stripe
Receive an order confirmation email
Track order status using phone number or email


TECH STACK

Frontend: React 19, Vite, Tailwind CSS, Framer Motion
Payments: Stripe with PaymentIntents and Webhooks
Backend: Node.js and Express
Database: MongoDB Atlas and Mongoose
Auth: JWT and Bcrypt
Email: Resend
Real-time: Socket.IO
Frontend Host: Cloudflare Pages
Backend Host: Render


PROJECT STRUCTURE

Backend contains Controllers, Middlewares, Models, Routes, Validators, config, utils and server.mjs
Frontend src contains components, context, pages, services and utils


LOCAL DEVELOPMENT

Requirements: Node.js 18 or higher, MongoDB Atlas account, Stripe account

Backend setup
cd Backend
npm install
Create a .env file in the Backend folder. See .env.example for all required variables.
To generate the owner password hash run this once: node generateHash.mjs
To start the server run: npm run dev

Frontend setup
cd frontend
npm install
npm run dev
Open http://localhost:5173


ENVIRONMENT VARIABLES

All secrets live in Backend/.env and must never be committed to the repository.
See Backend/.env.example for all required variables including Stripe keys, MongoDB URI, JWT secret and Resend API key.
The frontend requires one variable: VITE_API_URL pointing to your backend URL.


PAYMENT FLOW

1. Customer checks out
2. Frontend requests a PaymentIntent from the backend
3. Backend creates the PaymentIntent via Stripe
4. Customer completes payment in Stripe Elements
5. Frontend saves the order to the database
6. Stripe webhook fires as a backup confirmation
7. Order saved in MongoDB and emails sent
8. Customer lands on the order confirmation page


API REFERENCE

POST /api/auth/login - Owner login
GET /api/menu - Get all menu items
POST /api/menu - Add a menu item, owner only
PUT /api/menu/:id - Update a menu item, owner only
DELETE /api/menu/:id - Delete a menu item, owner only
GET /api/orders - Get all orders, owner only
POST /api/orders - Place an order
PATCH /api/orders/:id - Update order status, owner only
GET /api/orders/track/:identifier - Track order by phone or email
GET /api/orders/by-payment/:id - Get order by payment ID
GET /api/payments/config - Get Stripe publishable key
POST /api/payments/create-intent - Create a payment intent
POST /api/webhook - Stripe webhook handler
POST /webhook/stripe - Legacy Stripe webhook handler


DEPLOYMENT

Frontend: Cloudflare Pages. Connect the repo, set root to frontend, build command npm run build, output directory dist.
Backend: Render. Connect the repo, set root to Backend, build command npm install, start command node server.mjs. Add all environment variables in the Render dashboard.


Built by The BrandHelper - thebrandhelper.com
