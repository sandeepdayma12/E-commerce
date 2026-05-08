from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import RefreshToken


class RefreshTokenRepo:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        token_hash: str,
        expires_at: datetime,
        user_id: int | None = None,
        admin_id: int | None = None,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> RefreshToken:
        token = RefreshToken(
            token_hash=token_hash,
            user_id=user_id,
            admin_id=admin_id,
            expires_at=expires_at,
            user_agent=user_agent,
            ip_address=ip_address,
        )
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token

    def get_valid(self, token_hash: str) -> RefreshToken | None:
        now = datetime.utcnow()
        return (
            self.db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == token_hash,
                RefreshToken.expires_at > now,
                RefreshToken.revoked_at.is_(None),
            )
            .first()
        )

    def revoke(self, token_hash: str) -> None:
        token = self.db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
        if token and token.revoked_at is None:
            token.revoked_at = datetime.utcnow()
            self.db.commit()
