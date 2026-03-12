import os
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import mapper, sessionmaker
from sentence_transformers import SentenceTransformer

DATABASE_URL = "postgresql://sandeep:sandeep@localhost:5433/product_service"
MODEL_NAME = "all-MiniLM-L6-v2"


engine = create_engine(DATABASE_URL)
metadata = MetaData()
metadata.reflect(bind=engine) 


products_table = Table("products", metadata, autoload_with=engine)

class Product:
    pass

mapper(Product, products_table)

SessionLocal = sessionmaker(bind=engine)


def Backfill():
    print("Starting embedding process...")
    print(f"Loading Sentence-Transformer model: '{MODEL_NAME}'")
    model = SentenceTransformer(MODEL_NAME)

    session = SessionLocal()

 
    products_to_update = session.query(Product).filter(Product.embedding == None).all()
    if not products_to_update:
        print("No products to update. All embeddings already exist.")
        return

    texts_to_embed = [f"{p.name}: {p.description}" for p in products_to_update]

    
    embeddings = model.encode(texts_to_embed)

    for product, embedding in zip(products_to_update, embeddings):
        product.embedding = embedding.tolist()  

    session.commit()
    session.close()
    print(f"Successfully updated {len(products_to_update)} products with embeddings!")


if __name__ == "__main__":
    Backfill()
