import json
from datetime import datetime
from urllib.parse import quote
from urllib.request import Request
from urllib.request import urlopen

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.road import RoadIncident, RoadSegment, RiskPrediction
from app.models.route import RoutePlan, TrackingPoint
from app.models.user import User
from app.schemas.route import (
    RoutePlanCreate,
    RoutePlanResponse,
    TrackingPointCreate,
    TrackingPointResponse,
    AlertResponse,
    TerrainAnalysisResponse,
    WeatherResponse,
)
from app.core.config import settings

router = APIRouter(prefix="/api/v1", tags=["Routes and tracking"])


def _json_get(url: str):
    request = Request(url, headers={"User-Agent": "RouteSetu/1.0 route-planning-demo"})
    with urlopen(request, timeout=settings.WEATHER_API_TIMEOUT_SECONDS) as response:
        return json.load(response)


def _real_route(origin: str, destination: str):
    origin_result = _json_get(
        "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=" + quote(origin)
    )
    destination_result = _json_get(
        "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=" + quote(destination)
    )
    if not origin_result or not destination_result:
        raise ValueError("Locations were not found")
    start = (float(origin_result[0]["lon"]), float(origin_result[0]["lat"]))
    end = (float(destination_result[0]["lon"]), float(destination_result[0]["lat"]))
    route = _json_get(
        "https://router.project-osrm.org/route/v1/driving/"
        f"{start[0]},{start[1]};{end[0]},{end[1]}?overview=full&geometries=geojson"
    )["routes"][0]
    return {
        "distance_km": round(float(route["distance"]) / 1000, 1),
        "duration_minutes": max(1, round(float(route["duration"]) / 60)),
        "geometry": route["geometry"]["coordinates"],
    }


@router.post("/routes", response_model=RoutePlanResponse, status_code=201)
def create_route(
    data: RoutePlanCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    road = (
        db.query(RoadSegment)
        .filter(
            RoadSegment.origin.ilike(f"%{data.origin}%"),
            RoadSegment.destination.ilike(f"%{data.destination}%"),
        )
        .first()
    )
    try:
        calculated = _real_route(data.origin, data.destination)
    except (KeyError, IndexError, OSError, ValueError, TypeError):
        distance = 285.0 if road and road.condition_status == "safe" else 310.0
        calculated = {
            "distance_km": distance,
            "duration_minutes": 495 if distance == 310 else 405,
            "geometry": [],
        }
    risk = "high" if road and road.condition_status == "risky" else "low"
    plan = RoutePlan(
        user_id=user.id,
        origin=data.origin,
        destination=data.destination,
        vehicle_type=data.vehicle_type,
        distance_km=calculated["distance_km"],
        duration_minutes=calculated["duration_minutes"],
        risk_level=risk,
        geometry=calculated["geometry"],
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("/routes", response_model=list[RoutePlanResponse])
def list_routes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(RoutePlan).filter(RoutePlan.user_id == user.id).order_by(RoutePlan.created_at.desc()).all()


@router.post("/routes/{route_id}/tracking", response_model=TrackingPointResponse, status_code=201)
def add_tracking_point(
    route_id: int,
    data: TrackingPointCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    route = db.query(RoutePlan).filter(RoutePlan.id == route_id, RoutePlan.user_id == user.id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    route.status = "in_progress"
    point = TrackingPoint(route_id=route_id, **data.model_dump())
    db.add(point)
    db.commit()
    db.refresh(point)
    return point


@router.get("/routes/{route_id}/tracking/latest", response_model=TrackingPointResponse | None)
def latest_tracking_point(
    route_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    route = db.query(RoutePlan).filter(RoutePlan.id == route_id, RoutePlan.user_id == user.id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return (
        db.query(TrackingPoint)
        .filter(TrackingPoint.route_id == route_id)
        .order_by(TrackingPoint.recorded_at.desc())
        .first()
    )


@router.get("/routes/{route_id}/analysis", response_model=TerrainAnalysisResponse)
def analyze_route(
    route_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    route = db.query(RoutePlan).filter(RoutePlan.id == route_id, RoutePlan.user_id == user.id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    road = (
        db.query(RoadSegment)
        .filter(RoadSegment.origin.ilike(f"%{route.origin.strip()}%"))
        .first()
    )
    risk = db.query(RiskPrediction).filter(RiskPrediction.road_id == road.id).order_by(RiskPrediction.created_at.desc()).first() if road else None
    incidents = db.query(RoadIncident).filter(RoadIncident.road_id == road.id).order_by(RoadIncident.reported_at.desc()).limit(3).all() if road else []
    score = round(risk.score) if risk else (68 if route.risk_level == "high" else 28)
    level = risk.level if risk else route.risk_level
    terrain_type = "Mountain corridor" if any(word in f"{route.origin} {route.destination}".lower() for word in ("tawang", "bomdila", "shimla", "manali", "mountain")) else "Mixed highway corridor"
    terrain_summary = "Steep gradients and exposed passes require low-speed driving and visibility checks." if terrain_type == "Mountain corridor" else "Mostly connected highway corridor with changing road and weather conditions."
    hazards = [{"title": incident.incident_type.title(), "text": incident.description, "severity": incident.severity} for incident in incidents]
    if not hazards:
        hazards = [{"title": "Weather watch", "text": "Check live weather before departure and during the trip.", "severity": "medium" if score >= 35 else "low"}]
    action = risk.recommended_action if risk else ("Reduce speed and monitor conditions." if score >= 35 else "Continue with normal monitoring.")
    base_profile = [22, 30, 28, 45, 52, 48, 62, 58] if terrain_type == "Mountain corridor" else [18, 24, 22, 28, 31, 29, 35, 32]
    profile = [min(100, value + max(0, score - 35) // 4) for value in base_profile]
    return TerrainAnalysisResponse(
        route_id=route.id,
        route_name=f"{route.origin} to {route.destination}",
        risk_score=score,
        risk_level=level,
        terrain_type=terrain_type,
        terrain_summary=terrain_summary,
        elevation_profile=profile,
        hazards=hazards,
        recommended_action=action,
        data_source="RouteSetu road intelligence and selected route data",
        is_simulated=True,
    )


@router.patch("/routes/{route_id}/status", response_model=RoutePlanResponse)
def update_route_status(
    route_id: int,
    status: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if status not in {"planned", "in_progress", "completed", "cancelled"}:
        raise HTTPException(status_code=422, detail="Invalid route status")
    route = db.query(RoutePlan).filter(RoutePlan.id == route_id, RoutePlan.user_id == user.id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    route.status = status
    db.commit()
    db.refresh(route)
    return route


@router.get("/weather", response_model=WeatherResponse)
def get_weather(location: str = "Bomdila"):
    normalized = location.strip() or "Bomdila"
    try:
        geocode_url = (
            "https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&format=json&name="
            + quote(normalized)
        )
        with urlopen(geocode_url, timeout=settings.WEATHER_API_TIMEOUT_SECONDS) as response:
            place = json.load(response)["results"][0]
        forecast_url = (
            "https://api.open-meteo.com/v1/forecast?current=temperature_2m,wind_speed_10m,"
            "precipitation,rain&hourly=precipitation_probability,visibility&forecast_days=1&timezone=auto&"
            f"latitude={place['latitude']}&longitude={place['longitude']}"
        )
        with urlopen(forecast_url, timeout=settings.WEATHER_API_TIMEOUT_SECONDS) as response:
            forecast = json.load(response)
        current = forecast["current"]
        probability = int(forecast.get("hourly", {}).get("precipitation_probability", [0])[0])
        visibility = float(forecast.get("hourly", {}).get("visibility", [10000])[0]) / 1000
        raining = float(current.get("rain", 0)) > 0 or float(current.get("precipitation", 0)) > 0
        return WeatherResponse(
            location=place.get("name", normalized),
            condition="Rain" if raining else "Clear conditions",
            temperature_c=float(current["temperature_2m"]),
            rain_probability=probability,
            wind_kmh=float(current["wind_speed_10m"]),
            visibility_km=round(visibility, 1),
            advisory="Reduce speed and check visibility before continuing." if raining else "Conditions are suitable for normal travel.",
            is_simulated=False,
        )
    except (KeyError, IndexError, OSError, ValueError, TypeError):
        is_wet = any(term in normalized.lower() for term in ("bomdila", "tawang", "mountain"))
    return WeatherResponse(
        location=normalized,
        condition="Heavy rain" if is_wet else "Partly cloudy",
        temperature_c=16.0 if is_wet else 22.0,
        rain_probability=78 if is_wet else 24,
        wind_kmh=18.0 if is_wet else 11.0,
        visibility_km=4.2 if is_wet else 8.5,
        advisory="Reduce speed and avoid exposed passes after 4:00 PM." if is_wet else "Conditions are suitable for normal travel.",
        is_simulated=True,
    )


@router.get("/alerts", response_model=list[AlertResponse])
def list_alerts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    incidents = db.query(RoadIncident).order_by(RoadIncident.reported_at.desc()).limit(20).all()
    risks = db.query(RiskPrediction).order_by(RiskPrediction.created_at.desc()).limit(20).all()
    alerts = [
        AlertResponse(
            id=f"incident-{incident.id}",
            title=f"{incident.incident_type.title()} incident",
            message=incident.description,
            severity=incident.severity,
            created_at=incident.reported_at,
            source="incident",
        )
        for incident in incidents
    ]
    alerts.extend(
        AlertResponse(
            id=f"risk-{risk.id}",
            title=f"{risk.level.title()} route risk",
            message=risk.recommended_action,
            severity=risk.level,
            created_at=risk.created_at,
            source="risk",
        )
        for risk in risks
    )
    return sorted(alerts, key=lambda alert: alert.created_at, reverse=True)