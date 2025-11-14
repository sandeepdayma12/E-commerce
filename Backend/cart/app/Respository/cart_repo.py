from app.Respository.Base_repo import Base_Repo
from app.models.models import Cart, CartItem # Use standard CamelCase naming
from sqlalchemy.orm import Session, joinedload

class Cart_Repo(Base_Repo):
    def __init__(self, db: Session):
        super().__init__(db)

    def get_or_create_cart(self, user_id: str) -> Cart:
        """
        Retrieves a cart by user_id. If it doesn't exist, it creates one.
        This is a much better name for this operation.
        """
        # A repository method should not handle validation like `if not user_id`.
        # That's the service or router's job.
        cart = self.db.query(Cart).options(joinedload(Cart.items)).filter(Cart.user_id == user_id).first()
        
        if not cart:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)
            
        return cart

    def add_item_to_cart(self, cart: Cart, product_id: int, quantity: int) -> Cart:
        """
        Adds an item to a specific cart object.
        """
        item = self.db.query(CartItem).filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == product_id
        ).first()

        if item:
            item.quantity += quantity
        else:
            item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            self.db.add(item)
        
        self.db.commit()
        self.db.refresh(cart)
        return cart

    def update_item_quantity(self, cart: Cart, product_id: int, new_quantity: int) -> Cart:
        """
        Updates the quantity of a specific item within a given cart.
        """
        # CORRECTED LOGIC: Find the item using cart_id and product_id.
        item = self.db.query(CartItem).filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == product_id
        ).first()

        if item:
            item.quantity = new_quantity
            self.db.commit()
            self.db.refresh(cart)
            return cart
        
        # If the item was not found, return None so the service layer can handle the error.
        return None

    def delete_item_to_cart(self, cart: Cart, product_id: int) -> Cart:
        """
        Deletes a specific item from a given cart.
        """
        # CORRECTED LOGIC: Find the item to delete.
        item = self.db.query(CartItem).filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == product_id
        ).first()

        if item:
            self.db.delete(item)
            self.db.commit()
            # CORRECTED REFRESH: Refresh the cart, not the deleted item.
            self.db.refresh(cart)
            return cart

        # If the item was not found, return None.
        return None

    def clear_cart(self, cart: Cart):
        """
        Deletes all items associated with a given cart.
        """
        # The logic here was already correct, just using the standard model name.
        self.db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        self.db.commit()