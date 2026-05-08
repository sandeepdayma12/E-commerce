"""add refresh tokens

Revision ID: 9b3e1f2c9f3a
Revises: 62b1d28ff4fa
Create Date: 2026-03-18 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9b3e1f2c9f3a"
down_revision = "62b1d28ff4fa"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("admin_id", sa.Integer(), sa.ForeignKey("admins.id"), nullable=True),
        sa.Column("token_hash", sa.String(length=128), nullable=False),
        sa.Column("user_agent", sa.String(length=255), nullable=True),
        sa.Column("ip_address", sa.String(length=45), nullable=True),
        sa.Column("revoked_at", sa.DateTime(), nullable=True),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
    )
    op.create_index("ix_refresh_tokens_token_hash", "refresh_tokens", ["token_hash"], unique=True)
    op.create_index("ix_refresh_tokens_user_admin", "refresh_tokens", ["user_id", "admin_id"])


def downgrade() -> None:
    op.drop_index("ix_refresh_tokens_user_admin", table_name="refresh_tokens")
    op.drop_index("ix_refresh_tokens_token_hash", table_name="refresh_tokens")
    op.drop_table("refresh_tokens")
