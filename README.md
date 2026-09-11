# 🚚 NER Smart Logistics Platform

AI-Based Smart Logistics and Accessibility Intelligence Platform for the North Eastern Region (NER).

---

## 📋 Project Overview

This project is designed to provide intelligent and risk-aware route planning for the North Eastern Region of India.

The platform will use:

- Road network data
- Weather conditions
- Terrain information
- Historical incidents
- Risk analysis
- Route optimization
- Dynamic rerouting
- Accessibility information

The system will provide users with safer and optimized routes between locations.

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- React Router
- CSS

## Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT Authentication
- PostgreSQL

## Database

- PostgreSQL

## Local development

Run the polished frontend and backend in separate terminals:

```bash
cd routesetu-frontend
npm install
npm run dev
```

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

The backend uses SQLite by default for local development and PostgreSQL when
`DATABASE_URL` is configured for production.

---

# 📁 Project Structure

```text
sih_project07/
│
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── alembic.ini
│   ├── requirements.txt
│   └── README.md
│
└── sih_frontend_vite/
    ├── src/
    ├── public/
    ├── package.json
    ├── package-lock.json
    └── README.md
