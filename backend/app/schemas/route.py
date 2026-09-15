from datetime import datetime

from pydantic import BaseModel, Field


class RoutePlanCreate(BaseModel):
    origin: str = Field(min_length=2, max_length=120)
    destination: str = Field(min_length=2, max_length=120)
    vehicle_type: str = Field(default="heavy goods vehicle", min_length=2, max_length=80)


class RoutePlanResponse(BaseModel):
    id: int
    origin: str
    destination: str
    vehicle_type: str
    status: str
    distance_km: float
    duration_minutes: int
    risk_level: str
    geometry: list[list[float]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TrackingPointCreate(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    speed_kmh: float = Field(default=0, ge=0, le=250)


class TrackingPointResponse(TrackingPointCreate):
    id: int
    route_id: int
    recorded_at: datetime

    class Config:
        from_attributes = True


class WeatherResponse(BaseModel):
    location: str
    condition: str
    temperature_c: float
    rain_probability: int
    wind_kmh: float
    visibility_km: float
    advisory: str
    is_simulated: bool


class AlertResponse(BaseModel):
    id: str
    title: str
    message: str
    severity: str
    created_at: datetime
    source: str


class TerrainAnalysisResponse(BaseModel):
    route_id: int
    route_name: str
    risk_score: int
    risk_level: str
    terrain_type: str
    terrain_summary: str
    elevation_profile: list[int]
    hazards: list[dict]
    recommended_action: str
    data_source: str
    is_simulated: bool