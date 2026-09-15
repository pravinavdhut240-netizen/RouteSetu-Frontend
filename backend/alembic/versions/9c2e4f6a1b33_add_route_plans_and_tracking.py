"""add route plans and tracking

Revision ID: 9c2e4f6a1b33
Revises: 8f3d1c7a4b22
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "9c2e4f6a1b33"
down_revision: Union[str, Sequence[str], None] = "8f3d1c7a4b22"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "route_plans",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("origin", sa.String(120), nullable=False),
        sa.Column("destination", sa.String(120), nullable=False),
        sa.Column("vehicle_type", sa.String(80), nullable=False),
        sa.Column("status", sa.String(20), nullable=False),
        sa.Column("distance_km", sa.Float(), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=False),
        sa.Column("risk_level", sa.String(20), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_route_plans_id", "route_plans", ["id"])
    op.create_index("ix_route_plans_user_id", "route_plans", ["user_id"])
    op.create_table(
        "tracking_points",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("route_id", sa.Integer(), sa.ForeignKey("route_plans.id"), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("speed_kmh", sa.Float(), nullable=False),
        sa.Column("recorded_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_tracking_points_id", "tracking_points", ["id"])
    op.create_index("ix_tracking_points_route_id", "tracking_points", ["route_id"])


def downgrade() -> None:
    op.drop_index("ix_tracking_points_route_id", table_name="tracking_points")
    op.drop_index("ix_tracking_points_id", table_name="tracking_points")
    op.drop_table("tracking_points")
    op.drop_index("ix_route_plans_user_id", table_name="route_plans")
    op.drop_index("ix_route_plans_id", table_name="route_plans")
    op.drop_table("route_plans")