import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { CategoriesGrid } from "@/pages/CategoriesGrid";
import { ProductsListing } from "@/pages/ProductsListing";
import { ProductDetails } from "@/pages/ProductDetails";
import { BundlesListing } from "@/pages/BundlesListing";
import { Cart } from "@/pages/Cart";
import { VehicleProvider } from "@/context/VehicleContext";

export default function App() {
  return (
    <VehicleProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<CategoriesGrid />} />
            <Route path="/products" element={<ProductsListing />} />
            <Route path="/products/:slug" element={<ProductsListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/bundles" element={<BundlesListing />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </VehicleProvider>
  );
}
