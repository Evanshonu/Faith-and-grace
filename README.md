FAITH AND GRACE CATERING — PROJECT README


WHAT IS THIS APP

Faith and Grace is an online ordering platform for a West African catering business. Customers can browse the menu, add food to a cart, and pay online. The restaurant owner has a private dashboard to manage the menu and track orders in real time.


WHO IS IT FOR

Customers — people who want to order West African food for pickup or delivery.

The owner — manages dishes, sees incoming orders, and updates order status from pending to delivered.


WHAT CUSTOMERS CAN DO

Browse the full menu with categories and prices.
Add dishes to a cart and adjust quantities.

Choose pickup or delivery at checkout.

Pay securely online using a credit or debit card.

Get an order confirmation after payment.


WHAT THE OWNER CAN DO

Log in to a private dashboard at the /owner page.
Add, edit, or remove dishes from the menu.
Toggle dishes on or off without deleting them.
See all incoming orders in real time.
Move orders through statuses — Pending, Preparing, Ready, Delivered.
View past orders and total revenue.


TECH STACK

Frontend
React — builds the user interface.
Vite — runs and bundles the frontend fast.
Tailwind CSS — handles all the styling.
Framer Motion — handles animations and transitions.
Stripe Elements — secure card payment form built and managed by Stripe.

Backend
Node.js and Express — the server that handles all requests.
MongoDB and Mongoose — the database that stores menu items and orders.
JSON Web Tokens — keeps the owner dashboard secure after login.
Bcrypt — hashes the owner password so it is never stored as plain text.
Stripe — processes card payments securely.


FOLDER STRUCTURE

The project has two main folders.

frontend contains everything the customer sees. Inside it, src holds the pages folder with Home, Menu, Checkout, OrderConfirmation, and Admin. The components folder holds Navigation, Footer, and CartDropdown. The utils folder holds cart helper functions. The public/images folder holds all food photos.

Backend contains the server. The Routes folder holds URL definitions. The Controllers folder holds the logic for each route. The Models folder holds database schemas for orders and menu items. The Middlewares folder holds the JWT auth check and error handler. The Validators folder checks request data before saving. The config folder holds the MongoDB connection file. The server.mjs file starts the server.


HOW TO RUN IT LOCALLY

You need Node.js version 18 or higher, a MongoDB Atlas account, and a Stripe account.

Backend setup

Go into the Backend folder and run npm install.

Create a file called .env inside the Backend folder with the following values.

PORT set to 8000.
MONGO_URI set to your MongoDB Atlas connection string ending with /faithgrace.
JWT_SECRET set to any long random string.
OWNER_PASSWORD_HASH set to the output of running the generateHash.mjs script.
STRIPE_SECRET_KEY set to your Stripe test secret key.
STRIPE_PUBLISHABLE_KEY set to your Stripe test publishable key.

To generate the password hash run this once.
node generateHash.mjs
Copy the output and paste it as the value for OWNER_PASSWORD_HASH in the .env file.

To seed the menu into the database run this once.
node seed.mjs

To start the backend run this.
npm run dev

You should see two lines confirming the server and database are both running.

Frontend setup

Go into the frontend folder and run npm install, then npm run dev.
Open http://localhost:5173 in your browser.


HOW THE PAYMENT FLOW WORKS

The customer fills in their details and clicks checkout.
The frontend asks the backend to create a Stripe Payment Intent.
The backend calls Stripe and returns a client secret.
The frontend loads Stripe's secure card form using that secret.
The customer enters card details. Stripe handles this directly and card data never touches the server.
On success the frontend confirms the payment with the backend.
The backend saves the order to MongoDB.
The customer is redirected to the order confirmation page.


OWNER LOGIN

Go to the /owner page in the browser and enter the password set during setup. The session expires after 12 hours and the owner will be asked to log in again.


API ENDPOINTS

POST /api/auth/login — owner login, returns a JWT token.
GET /api/menu — public, returns all menu items.
POST /api/menu — owner only, adds a new dish.
PUT /api/menu/:id — owner only, edits a dish.
DELETE /api/menu/:id — owner only, removes a dish.
GET /api/orders — owner only, returns all orders.
GET /api/orders/:id — public, returns one order by ID.
POST /api/orders — public, customer places an order.
PATCH /api/orders/:id — owner only, updates order status.
GET /api/stripe-config — public, returns the Stripe publishable key.
POST /api/create-payment-intent — public, creates a Stripe payment intent.
POST /api/confirm-payment — public, confirms payment was successful.


GOING LIVE

When the app is ready for real customers make two changes.

First, swap the Stripe test keys for live keys in the .env file. Replace sk_test with sk_live and pk_test with pk_live.

Second, update the CORS origin in server.mjs from http://localhost:5173 to your real domain name.

No other code changes are needed.


CONTACT
OWNER:
Phone: 862-212-9328
Email: gnigriel@yahoo.com

DEVELOPERS:
evaanshonu@gmail.com
blackbird77ad@gmail.com

AECHITECTURE:
User places order
      ↓
Frontend calls backend /payments/create
      ↓
Stripe PaymentIntent created
      ↓
User completes payment on frontend
      ↓
Stripe sends webhook → backend
      ↓
Backend verifies webhook
      ↓
Order marked PAID in MongoDB
      ↓
Email sent to customer
      ↓
Owner dashboard sees paid order