"""add road intelligence tables

Revision ID: 8f3d1c7a4b22
Revises: 5d7a7f3c2b11
"""

from datetime import datetime
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "8f3d1c7a4b22"
down_revision: Union[str, Sequence[str], None] = "5d7a7f3c2b11"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "road_segments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("origin", sa.String(length=120), nullable=False),
        sa.Column("destination", sa.String(length=120), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("condition_status", sa.String(length=20), nullable=False),
        sa.Column("is_simulated", sa.Boolean(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_road_segments_id", "road_segments", ["id"])

    op.create_table(
        "risk_predictions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("road_id", sa.Integer(), sa.ForeignKey("road_segments.id"), nullable=False),
        sa.Column("score", sa.Float(), nullable=False),
        sa.Column("level", sa.String(length=20), nullable=False),
        sa.Column("reason", sa.Text(), nullable=False),
        sa.Column("prediction_window", sa.String(length=100), nullable=False),
        sa.Column("recommended_action", sa.String(length=255), nullable=False),
        sa.Column("inputs", sa.JSON(), nullable=False),
        sa.Column("is_simulated", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_risk_predictions_id", "risk_predictions", ["id"])
    op.create_index("ix_risk_predictions_road_id", "risk_predictions", ["road_id"])

    op.create_table(
        "road_incidents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("road_id", sa.Integer(), sa.ForeignKey("road_segments.id"), nullable=False),
        sa.Column("incident_type", sa.String(length=40), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("severity", sa.String(length=20), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("reported_by_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("is_simulated", sa.Boolean(), nullable=False),
        sa.Column("reported_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_road_incidents_id", "road_incidents", ["id"])
    op.create_index("ix_road_incidents_road_id", "road_incidents", ["road_id"])

    roads = sa.table(
        "road_segments",
        sa.column("id", sa.Integer()),
        sa.column("name", sa.String()),
        sa.column("origin", sa.String()),
        sa.column("destination", sa.String()),
        sa.column("latitude", sa.Float()),
        sa.column("longitude", sa.Float()),
        sa.column("condition_status", sa.String()),
        sa.column("is_simulated", sa.Boolean()),
        sa.column("updated_at", sa.DateTime()),
    )
    risks = sa.table(
        "risk_predictions",
        sa.column("road_id", sa.Integer()),
        sa.column("score", sa.Float()),
        sa.column("level", sa.String()),
        sa.column("reason", sa.Text()),
        sa.column("prediction_window", sa.String()),
        sa.column("recommended_action", sa.String()),
        sa.column("inputs", sa.JSON()),
        sa.column("is_simulated", sa.Boolean()),
        sa.column("created_at", sa.DateTime()),
    )
    incidents = sa.table(
        "road_incidents",
        sa.column("road_id", sa.Integer()),
        sa.column("incident_type", sa.String()),
        sa.column("description", sa.Text()),
        sa.column("severity", sa.String()),
        sa.column("status", sa.String()),
        sa.column("latitude", sa.Float()),
        sa.column("longitude", sa.Float()),
        sa.column("is_simulated", sa.Boolean()),
        sa.column("reported_at", sa.DateTime()),
    )
    now = datetime.utcnow()
    op.bulk_insert(
        roads,
        [
            {
                "id": 1,
                "name": "NH-13 Bomdila Corridor",
                "origin": "Guwahati",
                "destination": "Tawang",
                "latitude": 27.264,
                "longitude": 92.424,
                "condition_status": "risky",
                "is_simulated": True,
                "updated_at": now,
            },
            {
                "id": 2,
                "name": "NH-6 Jowai Bypass",
                "origin": "Shillong",
                "destination": "Aizawl",
                "latitude": 25.452,
                "longitude": 92.197,
                "condition_status": "safe",
                "is_simulated": True,
                "updated_at": now,
            },
        ],
    )
    op.bulk_insert(
        risks,
        [
            {
                "road_id": 1,
                "score": 68.0,
                "level": "high",
                "reason": "Simulated heavy rainfall and steep terrain inputs.",
                "prediction_window": "Next 12 hours",
                "recommended_action": "Reduce speed and evaluate the safer corridor.",
                "inputs": {"rainfall_probability": 0.78, "terrain_steepness": 0.72},
                "is_simulated": True,
                "created_at": now,
            },
            {
                "road_id": 2,
                "score": 22.0,
                "level": "low",
                "reason": "Simulated clear weather and stable terrain inputs.",
                "prediction_window": "Next 12 hours",
                "recommended_action": "Continue monitoring conditions.",
                "inputs": {"rainfall_probability": 0.18, "terrain_steepness": 0.34},
                "is_simulated": True,
                "created_at": now,
            },
        ],
    )
    op.bulk_insert(
        incidents,
        [
            {
                "road_id": 1,
                "incident_type": "weather",
                "description": "Simulated heavy rainfall advisory near Bomdila.",
                "severity": "high",
                "status": "open",
                "latitude": 27.264,
                "longitude": 92.424,
                "is_simulated": True,
                "reported_at": now,
            }
        ],
    )


def downgrade() -> None:
    op.drop_index("ix_road_incidents_road_id", table_name="road_incidents")
    op.drop_index("ix_road_incidents_id", table_name="road_incidents")
    op.drop_table("road_incidents")
    op.drop_index("ix_risk_predictions_road_id", table_name="risk_predictions")
    op.drop_index("ix_risk_predictions_id", table_name="risk_predictions")
    op.drop_table("risk_predictions")
    op.drop_index("ix_road_segments_id", table_name="road_segments")
    op.drop_table("road_segments")
