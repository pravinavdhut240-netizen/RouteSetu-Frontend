from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.roads import router as roads_router
from app.api.routes import router as routes_router
from app.core.config import settings

app = FastAPI(
    title="NER Smart Logistics API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(roads_router)
app.include_router(routes_router)


@app.get("/api/hello")
def hello():
    return {
        "message": "Hello from FastAPI!"
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}