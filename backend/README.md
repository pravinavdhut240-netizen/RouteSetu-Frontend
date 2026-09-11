# RouteSetu backend

FastAPI authentication service for the polished RouteSetu frontend.

## Local setup

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

The default development database is SQLite (`routesetu.db`). Set `DATABASE_URL`
to a PostgreSQL connection string for production.

Health check:

```text
http://localhost:8000/api/health
```

Authentication endpoints:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
