# HRMS-Lite
HRMS Lite — Django (PyMongo) + React (Vite) Scaffold

This workspace contains a minimal scaffold for the HRMS Lite assignment using:

- Backend: Django + Django REST Framework with direct MongoDB access via PyMongo
- Frontend: React (Vite) served with `npm`

What I created:
- `backend/` — Django project `hrms_project` and an `api` app with simple REST endpoints backed by MongoDB (PyMongo).
- `frontend/` — Vite + React app (npm) with a basic Employee list and create form.

Quick start (Windows example):

1) Ensure a MongoDB instance is available (local or Atlas), note the connection URI.

2) Backend

```bash
cd "c:/Users/om_sa/OneDrive/Desktop/HRMS Lite application/backend"
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 
```

DEV API base: `http://localhost:8000/api/` (endpoints: `/employees`, `/attendance`)
LIve API base : `https://hrms-lite-backend-2fvs.onrender.com/`  (endpoints: `/employees`, `/attendance`)

3) Frontend

```bash
cd "c:/Users/om_sa/OneDrive/Desktop/HRMS-Lite/frontend"
npm install
npm run dev
```

Frontend dev server default: `http://localhost:5173`.
Frontend live server default: `https://hrms-lite-g4ii.vercel.app`.

Notes:
- Django is used as the web framework; persistence for app data is MongoDB accessed via PyMongo in API views (no Django ORM models used).
- This scaffold is minimal and intended to be extended: add auth, file upload, tests, Docker, CI, and more.