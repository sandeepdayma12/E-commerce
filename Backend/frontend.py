import streamlit as st
import requests
import os
import pandas as pd
from jose import jwt, JWTError

# ====================================================================
# CONFIGURATION
# ====================================================================
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://127.0.0.1:8000")
PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://192.168.29.249:8001")
CART_SERVICE_URL = os.getenv("CART_SERVICE_URL", "http://127.0.0.1:8002")

# We need the secret key to decode the token locally to check the role
SECRET_KEY = os.getenv("SECRET_KEY", "a_super_secret_key_that_must_be_identical_in_all_services")

# ====================================================================
# SESSION STATE INITIALIZATION
# ====================================================================
if 'token' not in st.session_state:
    st.session_state.token = None
if 'products' not in st.session_state:
    st.session_state.products = []
if 'user_role' not in st.session_state:
    st.session_state.user_role = None

# ====================================================================
# API HELPER FUNCTIONS
# ====================================================================
def get_auth_header():
    if st.session_state.token:
        return {"Authorization": f"Bearer {st.session_state.token}"}
    return None

def decode_token_role(token):
    """Decodes the JWT to find the user's role."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("role")
    except JWTError:
        return None

def fetch_products():
    """Calls the Product Service to get a list of all products."""
    try:
        response = requests.get(f"{PRODUCT_SERVICE_URL}/api/get_products")
        if response.status_code == 200:
            st.session_state.products = response.json()
        else:
            st.error(f"Failed to fetch products: {response.status_code} - {response.text}")
            st.session_state.products = []
    except requests.RequestException as e:
        st.error(f"Network error fetching products: {e}")

def add_product_to_cart(product_id: int, quantity: int):
    """Calls the Cart Service to add an item."""
    headers = get_auth_header()
    if not headers:
        st.warning("You must be logged in to add items to the cart.")
        return

    item_payload = {"product_id": product_id, "quantity": quantity}
    try:
        response = requests.post(f"{CART_SERVICE_URL}/cart/items", headers=headers, json=item_payload)
        if response.status_code == 200:
            st.toast(f"✅ Added to cart!")
        else:
            st.error(f"Failed to add item: {response.status_code}")
            st.json(response.json())
    except requests.RequestException as e:
        st.error(f"Network error adding to cart: {e}")

# ====================================================================
# SIDEBAR - For Authentication
# ====================================================================
st.sidebar.title("Authentication")
if st.session_state.token:
    st.sidebar.success(f"You are logged in as: **{st.session_state.user_role.upper() if st.session_state.user_role else 'USER'}**")
    if st.sidebar.button("Logout"):
        st.session_state.token = None
        st.session_state.user_role = None
        st.rerun()
else:
    st.sidebar.info("Please log in.")
    with st.sidebar.form("login_form"):
        login_type = st.radio("Login as:", ("User", "Admin"))
        email = st.text_input("Email (as username)")
        password = st.text_input("Password", type="password")
        login_button = st.form_submit_button("Login")
        
        if login_button:
            login_endpoint = "/user/login" if login_type == "User" else "/admin/login"
            login_payload = {"username": email, "password": password}
            try:
                response = requests.post(f"{AUTH_SERVICE_URL}{login_endpoint}", data=login_payload)
                if response.status_code == 200:
                    token = response.json().get("access_token")
                    st.session_state.token = token
                    st.session_state.user_role = decode_token_role(token)
                    st.rerun()
                else:
                    st.sidebar.error(f"Login failed: {response.status_code} - {response.text}")
            except requests.exceptions.RequestException as e:
                st.sidebar.error(f"Network error during login: {e}")

# ====================================================================
# MAIN PAGE
# ====================================================================
st.title("E-commerce Microservice Tester")

# Fetch products on first load
if 'products_fetched' not in st.session_state:
    fetch_products()
    st.session_state.products_fetched = True

tabs_to_show = ["📦 Products", "🛒 My Cart"]
if st.session_state.user_role == 'admin':
    tabs_to_show.append("🛠️ Product Management")

tabs = st.tabs(tabs_to_show)

# --- Products Tab (for all users) ---
with tabs[0]:
    st.header("Available Products")
    if st.button("🔄 Refresh Products List"):
        fetch_products()
    
    if not st.session_state.products:
        st.info("No products found. Click 'Refresh Products List' to fetch them.")
    else:
        for product in st.session_state.products:
            col1, col2 = st.columns([1, 3])
            with col1:
                # *** IMAGE DISPLAY ADDED HERE ***
                if product.get("image_paths") and len(product["image_paths"]) > 0:
                    # Construct the full URL for the image
                    image_url = f"{PRODUCT_SERVICE_URL}{product['image_paths'][0]}"
                    st.image(image_url, caption=product.get("name"), use_column_width=True)
                else:
                    st.caption("No Image")
            
            with col2:
                st.subheader(product.get("name", "N/A"))
                st.write(f"**Price:** ${product.get('price', 0.0):,.2f}")
                st.caption(product.get("description", ""))
                
                # Input for quantity and add to cart button
                inner_col1, inner_col2 = st.columns([1, 2])
                with inner_col1:
                    quantity = st.number_input("Qty", min_value=1, step=1, key=f"qty_{product.get('id')}", label_visibility="collapsed")
                with inner_col2:
                    st.button("Add to Cart", key=f"add_{product.get('id')}", on_click=add_product_to_cart, args=(product.get('id'), quantity))
            st.divider()

# --- Cart Tab (for logged-in users) ---
with tabs[1]:
    st.header("Your Shopping Cart")
    if not st.session_state.token:
        st.warning("Please log in to view your cart.")
    else:
        if st.button("🔄 Refresh Cart"):
            headers = get_auth_header()
            try:
                response = requests.get(f"{CART_SERVICE_URL}/cart/", headers=headers)
                if response.status_code == 200:
                    cart_data = response.json()
                    if cart_data.get('items'):
                        df = pd.DataFrame(cart_data['items'])
                        st.dataframe(df)
                        st.metric("Total Price", f"${cart_data.get('total_price', 0.0):,.2f}")
                    else:
                        st.info("Your cart is empty.")
                else:
                    st.error(f"Failed to fetch cart: {response.status_code}")
                    st.json(response.json())
            except requests.exceptions.RequestException as e:
                st.error(f"Network error fetching cart: {e}")

# --- Product Management Tab (Admin Only) ---
if st.session_state.user_role == 'admin':
    with tabs[2]:
        st.header("Manage Products")
        
        # --- Create a New Product ---
        with st.form("create_product_form", clear_on_submit=True):
            st.subheader("Create New Product")
            name = st.text_input("Product Name")
            price = st.number_input("Price", min_value=0.01, format="%.2f")
            quantity = st.number_input("Quantity in Stock", min_value=0, step=1)
            description = st.text_area("Description")
            category_id = st.number_input("Category ID", min_value=1, step=1)
            
            # *** FILE UPLOADER ADDED HERE ***
            uploaded_files = st.file_uploader(
                "Upload Product Images", 
                accept_multiple_files=True, 
                type=['png', 'jpg', 'jpeg']
            )
            
            create_button = st.form_submit_button("Create Product")

            if create_button:
                headers = get_auth_header()
                # Prepare form data
                product_data = {
                    "name": name, "price": price, "quantity": quantity,
                    "description": description, "category_id": category_id
                }
                
                # *** PREPARE FILES FOR MULTIPART UPLOAD ***
                # The key 'images' must match the FastAPI endpoint parameter
                files_to_upload = [('images', (file.name, file, file.type)) for file in uploaded_files]
                
                # Send a multipart/form-data request
                response = requests.post(
                    f"{PRODUCT_SERVICE_URL}/api/create_product/", 
                    headers=headers, 
                    data=product_data,
                    files=files_to_upload
                )

                if response.status_code == 200: # Your endpoint returns 200
                    st.success("Product created successfully!")
                    fetch_products() # Refresh list to show the new product
                else:
                    st.error(f"Failed to create product: {response.status_code}")
                    st.json(response.json())
        
        st.divider()

        # --- Delete a Product ---
        st.subheader("Delete a Product")
        if st.session_state.products:
            product_options = {f"{p['name']} (ID: {p['id']})": p['id'] for p in st.session_state.products}
            product_to_delete_name = st.selectbox("Select product to delete", product_options.keys())
            
            if st.button("Delete Selected Product", type="primary"):
                product_to_delete_id = product_options[product_to_delete_name]
                headers = get_auth_header()
                response = requests.delete(f"{PRODUCT_SERVICE_URL}/api/delete_product/{product_to_delete_id}", headers=headers)
                if response.status_code == 200:
                    st.success(f"Product '{product_to_delete_name}' deleted!")
                    fetch_products() # Refresh the list
                    st.rerun()
                else:
                    st.error(f"Failed to delete product: {response.status_code}")
                    st.json(response.json())
        else:
            st.warning("Refresh product list to see delete options.")