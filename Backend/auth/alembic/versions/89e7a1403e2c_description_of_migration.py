"""description_of_migration

Revision ID: 89e7a1403e2c
Revises: 7f714e61660a
Create Date: 2025-11-17 11:41:46.789215

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '89e7a1403e2c'
down_revision: Union[str, None] = '7f714e61660a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
