"""Description of this migration

Revision ID: 746ef046e716
Revises: 7c3561e57a06
Create Date: 2025-11-07 12:40:50.653939

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '746ef046e716'
down_revision: Union[str, Sequence[str], None] = '7c3561e57a06'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
