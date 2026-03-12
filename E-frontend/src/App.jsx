
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/pages/home/Home'
import Layout from './components/layout/Layout'
import About from './components/pages/about/About'
import Register from './components/pages/register/Register'
import Login from './components/pages/login/Login'
import AdminLogin from './components/admin/login/AdminLogin'
import Shop from './components/pages/shop/Shop'
import Profile from './components/pages/profile/Profile'
import Cart from './components/pages/cart/Cart'
import AdminRegister from './components/pages/register/AdminRegister'
import Contact from './components/pages/contact/Contact'
import ProductDetails from './components/pages/product/ProductDetails'
import Checkout from './components/pages/Checkout/Checkout'
import Admin from './components/admin/pages/dashboard/ Dashboard'
import AdminLayout from './components/admin/adminLayout/AdminLayout'
import CreateProduct from './components/admin/pages/products/CreateProduct'
import ProductList from './components/admin/pages/products/ProductList'
import CategoryList from './components/admin/pages/category/CategoryList'
import CreateCategory from './components/admin/pages/category/CreateCategory'
import OrderList from './components/admin/pages/Order/OrderList/OrderList'
import EditCategory from './components/admin/pages/category/EditCategory'
import EditProduct from './components/admin/pages/products/EditProduct'
import AdminProfile from './components/admin/adminProfile/AdminProfile'
import OrderSuccess from './components/pages/order/OrderSuccess'
import OrderHistory from './components/pages/order/OrderHistory'
import OrderDetails from './components/pages/order/OrderDetails'
import VendorDashboard from './components/admin/pages/dashboard/VendorDashboard'
import ScrollToTop from './components/ScrollToTop'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* All routes wrapped inside Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Admin />} />
          <Route path="/admin/venderDashboard" element={<VendorDashboard />} />
          <Route path="/admin/addProduct" element={<CreateProduct />} />
          <Route path="/admin/productList" element={<ProductList />} /><Route
            path="/admin/createProduct"
            element={
              <ProtectedAdminRoute>
                <CreateProduct />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/productList"
            element={
              <ProtectedAdminRoute>
                <ProductList />
              </ProtectedAdminRoute>
            }
          />

          <Route path="/admin/categoryList" element={<CategoryList />} />
          <Route path="/admin/createcategory" element={<CreateCategory />} />
          <Route path="/admin/orderList" element={<OrderList />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/editProduct/:id" element={<EditProduct />} />
          <Route path="/admin/editCategory/:id" element={<EditCategory />} />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
