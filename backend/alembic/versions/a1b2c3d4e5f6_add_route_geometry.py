"""add route geometry

Revision ID: a1b2c3d4e5f6
Revises: 9c2e4f6a1b33
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "9c2e4f6a1b33"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("route_plans", sa.Column("geometry", sa.JSON(), nullable=False, server_default="[]"))


def downgrade() -> None:
    op.drop_column("route_plans", "geometry")