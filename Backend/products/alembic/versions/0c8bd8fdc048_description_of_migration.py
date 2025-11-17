"""description of migration

Revision ID: 0c8bd8fdc048
Revises: 739a6df20840
Create Date: 2025-11-17 16:39:29.486213

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0c8bd8fdc048'
down_revision: Union[str, None] = '739a6df20840'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
