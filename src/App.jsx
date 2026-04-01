import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PublicLayout from './components/PublicLayout';
import { ToastProvider } from './components/Toast';

import Home from './pages/HomePage/Home';
import Contact from './pages/ContactPage/Contact';
import Product from './pages/ProductPage/Product';
import ProductDetails from './pages/ProductPage/ProductDetails';
import Login from './admin/Login';

import Dashboard from './admin/Dashboard';
import { ProductProvider } from './admin/ProductContext';
import { OrderProvider } from './admin/OrderContext';
import AdminLayout from './admin/AdminLayout';
import AddProduct from './admin/AddProduct';
import ProductsList from './admin/ProductsList';
import { InventoryProvider } from './admin/InventoryContext';
import InventoryManager from './admin/InventoryManager';
import { InProvider } from './admin/InContext';
import OrderManagement from './admin/OrderManagement';
import OrderDetails from './admin/OrderDetails';
import InvoiceManagement from './admin/InvoiceManagement';
import SliderManagement from './admin/SliderManagement';
import CategoryManagement from './admin/CategoryManagement';
import { CartProvider } from './Context/CartContext';
import AboutUs from './pages/AboutPage/AboutUs';
import SafetyGuidelines from './components/SafetyGuidelines';
import GreenPolicy from './components/GreenPolicy';
import GovernmentRegulations from './components/GovernmentRegulations';
import FAQ from './components/FAQ';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/Terms';
import RefundPolicy from './components/RefundPolicy';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ToastProvider>
        <div>
          <InventoryProvider>
            <ProductProvider>
              <OrderProvider>
                <InProvider>
                  <BrowserRouter>
                    <ScrollToTop />
                    <CartProvider>
                      <Routes>
                        <Route element={<PublicLayout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<AboutUs />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/products" element={<Product />} />
                          <Route
                            path="/product/:slug"
                            element={<ProductDetails />}
                          />
                          <Route
                            path="/safety"
                            element={<SafetyGuidelines />}
                          />
                          <Route
                            path="/policy/green-crackers"
                            element={<GreenPolicy />}
                          />
                          <Route
                            path="/regulations"
                            element={<GovernmentRegulations />}
                          />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/privacy" element={<PrivacyPolicy />} />
                          <Route
                            path="/terms"
                            element={<TermsAndConditions />}
                          />
                          <Route
                            path="/refund"
                            element={<RefundPolicy />}
                          />{' '}
                        </Route>

                        <Route path="/login" element={<Login />} />
                        <Route element={<AdminLayout />}>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route
                            path="/admin/add-product"
                            element={<AddProduct />}
                          />
                          <Route
                            path="/admin/products"
                            element={<ProductsList />}
                          />
                          <Route
                            path="/admin/inventory"
                            element={<InventoryManager />}
                          />
                          <Route
                            path="/admin/orders"
                            element={<OrderManagement />}
                          />
                          <Route
                            path="/admin/orders/:orderId"
                            element={<OrderDetails />}
                          />
                          <Route
                            path="/admin/invoices"
                            element={<InvoiceManagement />}
                          />
                          <Route
                            path="/admin/slider-management"
                            element={<SliderManagement />}
                          />
                          <Route
                            path="/admin/categories"
                            element={<CategoryManagement />}
                          />
                        </Route>
                      </Routes>
                    </CartProvider>
                  </BrowserRouter>
                </InProvider>
              </OrderProvider>
            </ProductProvider>
          </InventoryProvider>
        </div>
      </ToastProvider>
    </>
  );
}

export default App;
