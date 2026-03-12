import json
from pydantic import BaseModel, field_validator
from typing import List, Optional


class ProductSearchResult(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    image_path: Optional[List[str]] = None

    # ---- FIXED: validator must be inside the class ----
    @field_validator("image_path", mode="before")
    def convert_json_string(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)     # Convert JSON string → Python list
            except:
                return []
        return v

    model_config = {
        "from_attributes": True  # replaces orm_mode=True in Pydantic v2
    }


class SearchResponse(BaseModel):
    query: str
    results: List[ProductSearchResult]
