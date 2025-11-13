from app.Respository.cart_repo import Cart
from app.service.base_service import Base_Service
class Cart_Service(Base_Service):
    def  __init__(self,db):
        self.repo=Cart(db)
    def create_cart(self, user_id):
        return self.repo.clear_cart(user_id)
    def add_item_to_cart(self, product_id, user_id, quantity):
        item=self.repo.add_item_to_cart(product_id, user_id, quantity)
        if not item:
            return {"message":"itme not present in cart"}
        return item
    def update_item_to_quantity(self, product_id, quantity, cart):
         item=self.repo.update_item_to_quantity(product_id, quantity, cart)
         return item
    def delete_item_to_cart(self, product_id, cart):
         item=self.repo.delete_item_to_cart(product_id, cart)
         if not item:
             return{"message":"item not present in the cart"}
         return item
    def clear_cart(self, cart):
        return self.repo.clear_cart(cart)
    
        
