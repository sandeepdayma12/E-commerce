from app.Respository.Base_repo import Base_Repo
from app.models.models import Cart, CartItem # Use standard CamelCase naming
from sqlalchemy.orm import Session, joinedload

class Cart_Repo(Base_Repo):
    def __init__(self, db: Session):
        super().__init__(db)

    def get_or_create_cart(self, user_id: str) -> Cart:
        cart = self.db.query(Cart).options(joinedload(Cart.items)).filter(Cart.user_id == user_id).first()
        
        if not cart:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)
            
        return cart

    def add_item_to_cart(self, cart: Cart, product_id: int, quantity: int) -> Cart:
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
        item = self.db.query(CartItem).filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == product_id
        ).first()

        if item:
            item.quantity = new_quantity
            self.db.commit()
            self.db.refresh(cart)
            return cart
        return None

    def delete_item_to_cart(self, cart: Cart, product_id: int) -> Cart:
        
        item = self.db.query(CartItem).filter(
            CartItem.cart_id == cart.id,
            CartItem.product_id == product_id
        ).first()

        if item:
            self.db.delete(item)
            self.db.commit()
         
            self.db.refresh(cart)
            return cart

       
        return None

    def clear_cart(self, cart: Cart):
        self.db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        self.db.commit()