from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.database import get_db
from app.models.road import RoadIncident, RoadSegment, RiskPrediction
from app.models.user import User
from app.schemas.road import (
    IncidentCreate,
    IncidentResponse,
    RiskPredictionCreate,
    RiskPredictionResponse,
    RoadResponse,
)
from app.services.risk_service import condition_status_for_level, risk_level_for_score

router = APIRouter(prefix="/api/v1", tags=["Road intelligence"])


@router.get("/roads", response_model=list[RoadResponse])
def list_roads(db: Session = Depends(get_db)):
    return db.query(RoadSegment).order_by(RoadSegment.name).all()


@router.get("/roads/{road_id}", response_model=RoadResponse)
def get_road(road_id: int, db: Session = Depends(get_db)):
    road = db.query(RoadSegment).filter(RoadSegment.id == road_id).first()
    if not road:
        raise HTTPException(status_code=404, detail="Road not found")
    return road


@router.get("/incidents", response_model=list[IncidentResponse])
def list_incidents(db: Session = Depends(get_db)):
    return db.query(RoadIncident).order_by(RoadIncident.reported_at.desc()).all()


@router.get("/roads/{road_id}/incidents", response_model=list[IncidentResponse])
def list_road_incidents(road_id: int, db: Session = Depends(get_db)):
    if not db.query(RoadSegment).filter(RoadSegment.id == road_id).first():
        raise HTTPException(status_code=404, detail="Road not found")
    return (
        db.query(RoadIncident)
        .filter(RoadIncident.road_id == road_id)
        .order_by(RoadIncident.reported_at.desc())
        .all()
    )


@router.post(
    "/roads/{road_id}/incidents",
    response_model=IncidentResponse,
    status_code=201,
)
def create_incident(
    road_id: int,
    data: IncidentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    road = db.query(RoadSegment).filter(RoadSegment.id == road_id).first()
    if not road:
        raise HTTPException(status_code=404, detail="Road not found")

    incident = RoadIncident(
        road_id=road_id,
        reported_by_user_id=user.id,
        is_simulated=False,
        **data.model_dump(),
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident


@router.get("/risks", response_model=list[RiskPredictionResponse])
def list_risks(db: Session = Depends(get_db)):
    return db.query(RiskPrediction).order_by(RiskPrediction.created_at.desc()).all()


@router.post(
    "/roads/{road_id}/risk",
    response_model=RiskPredictionResponse,
    status_code=201,
)
def create_risk_prediction(
    road_id: int,
    data: RiskPredictionCreate,
    db: Session = Depends(get_db),
):
    road = db.query(RoadSegment).filter(RoadSegment.id == road_id).first()
    if not road:
        raise HTTPException(status_code=404, detail="Road not found")

    level = risk_level_for_score(data.score)
    prediction = RiskPrediction(
        road_id=road_id,
        level=level,
        **data.model_dump(),
    )
    road.condition_status = condition_status_for_level(level)
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction
