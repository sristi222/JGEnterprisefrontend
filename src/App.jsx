import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import ProductSection from "./components/ProductSection"
import BestSellingSection from "./components/BestSellingSection"
import LoginSignup from "./components/LoginSignup"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductdetailPage"
import ContactPage from "./pages/ContactPage"
import { CartProvider } from "./context/CartContext"
import CartPage from "./pages/CartPage"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <ProductSection />
                  <BestSellingSection />
                </>
              }
            />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
