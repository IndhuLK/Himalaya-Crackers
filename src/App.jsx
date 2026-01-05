import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/HomePage/Home";
import Contact from "./pages/ContactPage/Contact";
import Product from "./pages/ProductPage/Product";
import Login from "./admin/Login";

import Dashboard from "./admin/Dashboard";
import { ProductProvider } from "./admin/ProductContext";
import { OrderProvider } from "./admin/OrderContext";
import AdminLayout from "./admin/AdminLayout";
import AddProduct from "./admin/AddProduct";
import ProductsList from "./admin/ProductsList";
import { InventoryProvider } from "./admin/InventoryContext";
import InventoryManager from "./admin/InventoryManager";
import { InProvider } from "./admin/InContext";
import OrderManagement from "./admin/OrderManagement";
import SliderManagement from "./admin/SliderManagement";


function App() {
  return (
    <>
      <div>
        <InventoryProvider >
        <ProductProvider >
          <OrderProvider >
            <InProvider >
        <BrowserRouter>
        <Navbar/>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Product />} />

            <Route path="/login" element={<Login />} />
            <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/admin/add-product" element={<AddProduct />} />
            <Route path="/admin/products" element={<ProductsList />} />
            <Route path="/admin/inventory" element={<InventoryManager />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/slider-management" element={<SliderManagement />} />
            </Route>

          </Routes>

          <Footer/>
        </BrowserRouter>
        </InProvider>
        </OrderProvider>
         </ProductProvider>
         </InventoryProvider>
      </div>
    </>
  );
}

export default App;
