from pydantic import BaseModel

class Paymentintentcreate(BaseModel):
    amount: float
    order_id: int
    currency: str = 'usd'

class Paymentintentresponse(BaseModel):
    client_secret: str
    payment_id: int