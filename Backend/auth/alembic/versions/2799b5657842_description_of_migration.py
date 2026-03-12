"""description_of_migration

Revision ID: 2799b5657842
Revises: 7cff300b915f
Create Date: 2025-11-17 12:27:26.469714

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2799b5657842'
down_revision: Union[str, None] = '7cff300b915f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
