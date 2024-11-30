import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles/index.css';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import { ProductProvider } from './context/ProductContext';
import { Layout } from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <ProductProvider>
      <Router basename="/safevillage">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
        <SpeedInsights />
      </Router>
    </ProductProvider>
  );
}

export default App;
