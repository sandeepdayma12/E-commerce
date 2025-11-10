"""Description of this migration

Revision ID: 2aec5bf0d4f5
Revises: 746ef046e716
Create Date: 2025-11-07 12:47:50.374860

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2aec5bf0d4f5'
down_revision: Union[str, Sequence[str], None] = '746ef046e716'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
