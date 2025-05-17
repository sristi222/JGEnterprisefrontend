import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import ProductSection from "./components/ProductSection"
import BestSellingSection from "./components/BestSellingSection"
import LoginSignup from "./components/LoginSignup"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import ContactPage from "./pages/ContactPage"
import { CartProvider } from "./context/CartContext"
import CartPage from "./pages/CartPage"
import CartSidebar from "./components/CartSidebar"
import "./App.css"
import CheckoutPage from "./components/CheckoutPage"
import CheckoutSuccess from "./components/CheckoutSuccess"
// Admin imports
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import HeroSlider from "./pages/HeroSlider"
import Login from "./pages/Login"
import AddProduct from "./pages/products/AddProduct"
import EditProduct from "./pages/products/EditProduct"
import AdminLayout from "./components/AdminLayout"

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="App">
          <CartSidebar />
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/checkout"
              element={
                <>
                  <Navbar />
                  <CheckoutPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/checkout/success"
              element={
                <>
                  <Navbar />
                  <CheckoutSuccess />
                  <Footer />
                </>
              }
            />
          
            <Route
              path="/admin/categories"
              element={
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/hero-slider"
              element={
                <AdminLayout>
                  <HeroSlider />
                </AdminLayout>
              }
            />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin/products"
              element={
                <AdminLayout>
                  <Products />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products/add"
              element={
                <AdminLayout>
                  <AddProduct />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminLayout>
                  <EditProduct />
                </AdminLayout>
              }
            />
            
          
       

            {/* Customer Routes - With Navbar/Footer */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HeroSection />
                  <ProductSection />
                  <BestSellingSection />
                  <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <LoginSignup />
                  <Footer />
                </>
              }
            />
            <Route
              path="/products"
              element={
                <>
                  <Navbar />
                  <ProductsPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/product/:productId"
              element={
                <>
                  <Navbar />
                  <ProductDetailPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Navbar />
                  <CartPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <ContactPage />
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
