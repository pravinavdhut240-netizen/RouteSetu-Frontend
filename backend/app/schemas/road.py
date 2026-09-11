from datetime import datetime

from pydantic import BaseModel, Field


class RiskPredictionResponse(BaseModel):
    id: int
    road_id: int
    score: float
    level: str
    reason: str
    prediction_window: str
    recommended_action: str
    inputs: dict
    is_simulated: bool
    created_at: datetime

    class Config:
        from_attributes = True


class RoadResponse(BaseModel):
    id: int
    name: str
    origin: str
    destination: str
    latitude: float | None
    longitude: float | None
    condition_status: str
    is_simulated: bool
    updated_at: datetime

    class Config:
        from_attributes = True


class IncidentCreate(BaseModel):
    incident_type: str = Field(min_length=2, max_length=40)
    description: str = Field(min_length=2, max_length=2000)
    severity: str = Field(default="medium", pattern="^(low|medium|high|critical)$")
    latitude: float | None = None
    longitude: float | None = None


class IncidentResponse(BaseModel):
    id: int
    road_id: int
    incident_type: str
    description: str
    severity: str
    status: str
    latitude: float | None
    longitude: float | None
    reported_by_user_id: int | None
    is_simulated: bool
    reported_at: datetime

    class Config:
        from_attributes = True


class RiskPredictionCreate(BaseModel):
    score: float = Field(ge=0, le=100)
    reason: str = Field(min_length=2, max_length=2000)
    prediction_window: str = Field(min_length=2, max_length=100)
    recommended_action: str = Field(min_length=2, max_length=255)
    inputs: dict = Field(default_factory=dict)
    is_simulated: bool = True
