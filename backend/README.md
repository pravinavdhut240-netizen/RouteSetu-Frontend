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

Local development defaults to SQLite (`routesetu.db`). For PostgreSQL, set
`DATABASE_URL` to a connection string such as:

```text
postgresql+psycopg2://postgres:password@localhost:5432/routesetu
```

On Render, the `render.yaml` configuration provisions PostgreSQL and injects its
connection string into `DATABASE_URL`. The API startup command runs
`alembic upgrade head` before starting the server, which creates or updates the
PostgreSQL schema.

The existing SQLite file is not copied automatically to PostgreSQL. Export and
import its data separately if local data needs to be retained.

Health check:

```text
http://localhost:8000/api/health
```

Authentication endpoints:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Route intelligence endpoints:

- `POST /api/v1/routes` and `GET /api/v1/routes`
- `POST /api/v1/routes/{route_id}/tracking`
- `GET /api/v1/routes/{route_id}/tracking/latest`
- `PATCH /api/v1/routes/{route_id}/status?status=completed`
- `GET /api/v1/weather?location=Bomdila`
- `GET /api/v1/alerts`

Weather uses Open-Meteo without an API key. If the provider is unavailable, the
weather endpoint returns the local simulated fallback and marks it with
`is_simulated: true`. Configure the network timeout with
`WEATHER_API_TIMEOUT_SECONDS`.
