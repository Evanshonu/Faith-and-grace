# Quick Start Guide - Faith & Grace Catering Website

## TL;DR - Get Running in 5 Minutes

### Backend (Terminal 1):
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py populate_menu
python manage.py createsuperuser
python manage.py runserver
```

### Frontend (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```

### Visit:
- Website: http://localhost:5173
- Admin Panel: http://localhost:8000/admin

## Before Going Live

1. **Configure Email:**
   - Edit `backend/.env`
   - Add your email credentials
   - Test by placing an order

2. **Update Contact Info:**
   - Phone number: 862-212-9328 (already set)
   - Email: gnigriel@yahoo.com (already set)
   - Zelle: gnigriel@yahoo.com (already set)

3. **Customize Menu:**
   - Edit prices in `backend/orders/management/commands/populate_menu.py`
   - Run `python manage.py populate_menu` again

## Key Features

✅ Beautiful, responsive design
✅ Shopping cart functionality
✅ Email notifications
✅ Zelle payment tracking
✅ Admin order management
✅ Mobile-friendly interface

## Need Help?

Read the full README.md for detailed instructions on:
- Email configuration
- SMS setup (optional)
- Production deployment
- Troubleshooting
- API documentation

Happy cooking! 🍽️
