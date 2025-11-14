from app.Respository.cart_repo import Cart_Repo
from app.service.base_service import Base_Service
from app.models.models import Cart
from fastapi import HTTPException, status

class Cart_Service(Base_Service):
    def __init__(self, db):
        super().__init__(db)
        self.repo = Cart_Repo(db)

    def create_cart(self, user_id: str) -> Cart:
        return self.repo.get_or_create_cart(user_id=user_id)

    def add_item_to_cart(self, product_id: int, user_id: str, quantity: int) -> Cart:
        cart = self.repo.get_or_create_cart(user_id=user_id)
        # The method name in the service is 'add_item_to_cart', so the call should be to
        # a method with a matching name on the repo for clarity.
        # But your current call is to `self.repo.add_item`. Let's fix that.
        updated_cart = self.repo.add_item_to_cart( # <-- FIX THE CALL
            cart=cart, 
            product_id=product_id, 
            quantity=quantity
        )
        return updated_cart

    def update_item_to_quantity(self, product_id: int, quantity: int, cart: Cart) -> Cart:
        updated_cart = self.repo.update_item_quantity(
            cart=cart, 
            product_id=product_id, 
            new_quantity=quantity
        )
        if updated_cart is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found in cart."
            )
        return updated_cart

    def delete_item_to_cart(self, product_id: int, cart: Cart) -> Cart:
        updated_cart = self.repo.delete_item_to_cart(
            cart=cart, 
            product_id=product_id
        )
        if updated_cart is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found in cart."
            )
        return updated_cart

    def clear_cart(self, cart: Cart):
        self.repo.clear_cart(cart)
