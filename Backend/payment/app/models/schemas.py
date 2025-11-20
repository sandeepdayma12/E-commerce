from pydantic import BaseModel,validator
from typing import Optional
from typing import List

class Paymentintentcreate(BaseModel):
    amount:float
    order_id:int
    currency:str='usd'
class Paymentintentresponse(BaseModel):
    client_secret: str  
    payment_id: int
      