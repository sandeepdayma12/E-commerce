"""description_of_migration

Revision ID: 7cff300b915f
Revises: 1ab3678e980e
Create Date: 2025-11-17 12:26:02.264020

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7cff300b915f'
down_revision: Union[str, None] = '1ab3678e980e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
