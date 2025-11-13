from app.Respository.Base_repo import Base_Repo
from app.models.models import Cart,Cart_Items
from sqlalchemy.orm import Session, joinedload
class Cart(Base_Repo):
    def __init__(self,db):
        super.__init__(db)
    def create_cart(self, user_id):
        if not user_id:
            return {"message":"user id must be provided"}
        cart = self.db.query(Cart).options(joinedload(Cart.items)).filter(Cart.user_id == user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)
            
        return cart
    def add_item_to_cart(self, product_id, user_id, quantity):
        cart=self.clear_cart(user_id==user_id)
        item=self.db.query(Cart_Items).filter(Cart_Items.id==cart.id ,Cart_Items.product_id==product_id).first()
        if item:
            item.quantity+=quantity
        else:
            item =Cart_Items(cart_id=cart.id, product_id=product_id, quantity=quantity)
            self.db.add(item)
        
        self.db.commit()
        self.db.refresh(cart)
        return cart    
    def update_item_to_quantity(self, product_id, quantity, cart):
        item=self.db.query(Cart_Items).filter(Cart_Items.id==cart.id ,Cart_Items.product_id==product_id).first()
        if not item:
            return None

        item.quantity = quantity
        self.db.commit()
        self.db.refresh(cart)
        return cart
    def delete_item_to_cart(self, product_id, cart):
        item=self.db.query(Cart_Items).filter(Cart_Items.id==cart.id ,Cart_Items.product_id==product_id).first()
        if not item:
            return None
        self.db.delete(item)
        self.db.commit()
        self.db.refresh(item)
        return cart
    def clear_cart(self, cart):
        self.db.query(Cart_Items).filter(Cart_Items.cart_id == cart.id).delete()
        self.db.commit()
        self.db.refresh(cart)
        return cart
        
        
        