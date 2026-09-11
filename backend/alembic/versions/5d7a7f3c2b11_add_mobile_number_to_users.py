"""add mobile number to users

Revision ID: 5d7a7f3c2b11
Revises: db80ac8b9db2
"""
from alembic import op
import sqlalchemy as sa

revision = "5d7a7f3c2b11"
down_revision = "db80ac8b9db2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("mobile_number", sa.String(length=30), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "mobile_number")
