import os

from app.models.database import SessionLocal
from app.models.models import Category, Product


MOCK_ADMIN_ID = int(os.getenv("MOCK_ADMIN_ID", "1"))

MOCK_CATEGORIES = [
    {
        "category": "Fashion",
        "description": "Clothing, jackets, shoes, and everyday style essentials.",
    },
    {
        "category": "Electronics",
        "description": "Phones, computers, accessories, and consumer tech.",
    },
    {
        "category": "Gaming",
        "description": "Game gear, consoles, controllers, and performance accessories.",
    },
    {
        "category": "Home",
        "description": "Furniture and useful products for home and work spaces.",
    },
    {
        "category": "Beauty",
        "description": "Fragrance, personal care, and beauty products.",
    },
]

FEATURED_MOCK_PRODUCTS = [
    {
        "name": "Oversize Winter Jacket",
        "price": 2499,
        "quantity": 32,
        "description": "Warm oversized jacket with a relaxed fit for daily wear.",
        "category": "Fashion",
        "image_path": ["static/product_images/oversize jacket.avif"],
    },
    {
        "name": "Quilted Nylon Jacket",
        "price": 3199,
        "quantity": 18,
        "description": "Lightweight quilted nylon jacket with a clean modern finish.",
        "category": "Fashion",
        "image_path": ["static/product_images/Quilted nylon jacket.avif"],
    },
    {
        "name": "Teddy Jacket",
        "price": 2799,
        "quantity": 22,
        "description": "Soft teddy jacket made for comfort in cooler weather.",
        "category": "Fashion",
        "image_path": ["static/product_images/Teddy Jacket.avif"],
    },
    {
        "name": "Sneaker Shoes",
        "price": 1899,
        "quantity": 45,
        "description": "Comfortable sneakers for casual outfits and daily walking.",
        "category": "Fashion",
        "image_path": ["static/product_images/sneaker Shoes.png"],
    },
    {
        "name": "Realme Smartphone",
        "price": 14999,
        "quantity": 25,
        "description": "Feature-packed Android smartphone with a bright display.",
        "category": "Electronics",
        "image_path": ["static/product_images/realme.avif"],
    },
    {
        "name": "Motorola G85 5G",
        "price": 17999,
        "quantity": 16,
        "description": "5G smartphone with smooth performance and stylish design.",
        "category": "Electronics",
        "image_path": ["static/product_images/Motorola G85 5G.webp"],
    },
    {
        "name": "Laptop Pro 15",
        "price": 54999,
        "quantity": 10,
        "description": "Reliable laptop for work, study, and entertainment.",
        "category": "Electronics",
        "image_path": ["static/product_images/Laptop.png"],
    },
    {
        "name": "Wireless Keyboard",
        "price": 1299,
        "quantity": 55,
        "description": "Compact wireless keyboard with quiet keys.",
        "category": "Electronics",
        "image_path": ["static/product_images/Keyboard.png"],
    },
    {
        "name": "Gaming Controller",
        "price": 2199,
        "quantity": 28,
        "description": "Responsive game controller for smooth gameplay.",
        "category": "Gaming",
        "image_path": ["static/product_images/Gameport.png"],
    },
    {
        "name": "Gaming Monitor",
        "price": 11999,
        "quantity": 14,
        "description": "Crisp display monitor for gaming and productivity.",
        "category": "Gaming",
        "image_path": ["static/product_images/Monitor.png"],
    },
    {
        "name": "Study Table",
        "price": 4999,
        "quantity": 12,
        "description": "Simple study table with enough space for laptop and books.",
        "category": "Home",
        "image_path": ["static/product_images/Study table.png"],
    },
    {
        "name": "Perfume Classic",
        "price": 899,
        "quantity": 40,
        "description": "Fresh everyday perfume with a long-lasting fragrance.",
        "category": "Beauty",
        "image_path": ["static/product_images/women-Coll.png"],
    },
]


GENERATED_PRODUCT_SERIES = [
    {
        "prefix": "Urban Jacket",
        "category": "Fashion",
        "image_path": "static/product_images/mans jacket.png",
        "price": 1799,
        "description": "Everyday jacket for casual city styling.",
    },
    {
        "prefix": "Cropped Fluffy Jacket",
        "category": "Fashion",
        "image_path": "static/product_images/Cropped fluffy jacket.avif",
        "price": 2299,
        "description": "Soft cropped jacket with a warm textured finish.",
    },
    {
        "prefix": "Classic Sneaker",
        "category": "Fashion",
        "image_path": "static/product_images/sneaker Shoes.png",
        "price": 1499,
        "description": "Comfort sneakers for daily walking and casual outfits.",
    },
    {
        "prefix": "Everyday Handbag",
        "category": "Fashion",
        "image_path": "static/product_images/women-Coll.png",
        "price": 1299,
        "description": "Practical handbag with simple styling.",
    },
    {
        "prefix": "Realme Smart Phone",
        "category": "Electronics",
        "image_path": "static/product_images/realme.avif",
        "price": 11999,
        "description": "Reliable smartphone for browsing, photos, and daily use.",
    },
    {
        "prefix": "Vivo Smart Phone",
        "category": "Electronics",
        "image_path": "static/product_images/vivo.webp",
        "price": 13999,
        "description": "Slim Android smartphone with smooth everyday performance.",
    },
    {
        "prefix": "Samsung Galaxy Phone",
        "category": "Electronics",
        "image_path": "static/product_images/sumsung galaxy.jpeg",
        "price": 16999,
        "description": "Galaxy phone for work, entertainment, and social apps.",
    },
    {
        "prefix": "Laptop Workstation",
        "category": "Electronics",
        "image_path": "static/product_images/Laptop.png",
        "price": 45999,
        "description": "Laptop for study, business, and productivity.",
    },
    {
        "prefix": "Desktop Monitor",
        "category": "Electronics",
        "image_path": "static/product_images/Monitor.png",
        "price": 7999,
        "description": "Crisp monitor for work setups and entertainment.",
    },
    {
        "prefix": "Mechanical Keyboard",
        "category": "Electronics",
        "image_path": "static/product_images/Keyboard.png",
        "price": 1899,
        "description": "Responsive keyboard for fast typing and gaming.",
    },
    {
        "prefix": "Game Controller",
        "category": "Gaming",
        "image_path": "static/product_images/Gameport.png",
        "price": 1999,
        "description": "Comfortable controller for precise gameplay.",
    },
    {
        "prefix": "Gaming Console",
        "category": "Gaming",
        "image_path": "static/product_images/Game.png",
        "price": 29999,
        "description": "Entertainment console for modern gaming.",
    },
    {
        "prefix": "Gaming Cooling Fan",
        "category": "Gaming",
        "image_path": "static/product_images/gammaxx.png",
        "price": 2499,
        "description": "Cooling accessory for better gaming performance.",
    },
    {
        "prefix": "Gaming Speaker",
        "category": "Gaming",
        "image_path": "static/product_images/Frame 612.png",
        "price": 3499,
        "description": "Speaker system for immersive gaming sound.",
    },
    {
        "prefix": "Study Desk",
        "category": "Home",
        "image_path": "static/product_images/Study table.png",
        "price": 3999,
        "description": "Compact desk for study and work-from-home setups.",
    },
    {
        "prefix": "Modern Table",
        "category": "Home",
        "image_path": "static/product_images/Frame 600.png",
        "price": 4499,
        "description": "Modern table for rooms, offices, and reading corners.",
    },
    {
        "prefix": "Daily Walker",
        "category": "Home",
        "image_path": "static/product_images/walker.webp",
        "price": 2499,
        "description": "Useful support product for home mobility needs.",
    },
    {
        "prefix": "Room Decor Set",
        "category": "Home",
        "image_path": "static/product_images/Deal.jpeg",
        "price": 999,
        "description": "Simple decor set for refreshing home spaces.",
    },
    {
        "prefix": "Classic Perfume",
        "category": "Beauty",
        "image_path": "static/product_images/women-Coll.png",
        "price": 799,
        "description": "Fresh fragrance for daily use.",
    },
    {
        "prefix": "Premium Perfume",
        "category": "Beauty",
        "image_path": "static/product_images/female jacket.avif",
        "price": 1299,
        "description": "Long-lasting fragrance with a refined profile.",
    },
]

GENERATED_VARIANTS = [
    ("Black", 0, 0),
    ("White", 120, 4),
    ("Blue", 240, 8),
    ("Red", 360, 12),
    ("Green", 480, 16),
    ("Gold", 650, 20),
]


def build_generated_mock_products():
    products = []
    for series_index, series in enumerate(GENERATED_PRODUCT_SERIES, start=1):
        for variant_index, (variant, price_offset, quantity_offset) in enumerate(
            GENERATED_VARIANTS,
            start=1,
        ):
            products.append(
                {
                    "name": f"{series['prefix']} {variant} {variant_index:02d}",
                    "price": series["price"] + price_offset,
                    "quantity": 18 + quantity_offset + series_index,
                    "description": f"{series['description']} Variant: {variant}.",
                    "category": series["category"],
                    "image_path": [series["image_path"]],
                }
            )
    return products


MOCK_PRODUCTS = FEATURED_MOCK_PRODUCTS + build_generated_mock_products()


def seed_mock_products():
    db = SessionLocal()
    try:
        categories_by_name = {}

        for category_data in MOCK_CATEGORIES:
            category = (
                db.query(Category)
                .filter(Category.category == category_data["category"])
                .first()
            )
            if not category:
                category = Category(**category_data)
                db.add(category)
                db.flush()
            categories_by_name[category.category] = category

        created_count = 0
        for product_data in MOCK_PRODUCTS:
            exists = (
                db.query(Product)
                .filter(Product.name == product_data["name"])
                .first()
            )
            if exists:
                continue

            category = categories_by_name[product_data["category"]]
            product = Product(
                name=product_data["name"],
                price=product_data["price"],
                quantity=product_data["quantity"],
                description=product_data["description"],
                category_id=category.id,
                is_active=True,
                image_path=product_data["image_path"],
                admin_id=MOCK_ADMIN_ID,
            )
            db.add(product)
            created_count += 1

        db.commit()
        if created_count:
            print(f"Seeded {created_count} mock products.")
        else:
            print("Mock products already seeded.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
