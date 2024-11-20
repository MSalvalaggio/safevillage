import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles/index.css';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import AdminProducts from './components/AdminProducts';
import { ProductProvider } from './context/ProductContext';
import Admin from './components/Admin';
import { Layout } from './components/layout/Layout';
import HomePage from './components/home/HomePage';
// Remove ProjectsPage import
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once we have the auth state
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Don't render anything while checking auth
  if (loading) return null;

  return (
    <ProductProvider>
      <Router basename="/safevillage"> {/* Add basename here */}
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Remove projects route */}
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute user={user} loading={loading}>
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />

            {/* Add catch-all route for 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ProductProvider>
  );
}

export default App;
