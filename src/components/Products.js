import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Products.css';
import { useProducts } from '../context/ProductContext';

function Products() {
  const { products, loading, error } = useProducts();

  const convertGoogleDriveUrl = (url) => {
    if (!url) return '/placeholder.png';
    try {
      if (url.includes('drive.google.com')) {
        let fileId = '';
        if (url.includes('/file/d/')) {
          fileId = url.split('/file/d/')[1].split('/')[0];
        } else if (url.includes('id=')) {
          fileId = url.split('id=')[1].split('&')[0];
        } else {
          fileId = url.match(/[-\w]{25,}/)?.[0];
        }
        return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w500` : '/placeholder.png';
      }
      return url;
    } catch (error) {
      console.error('Error converting URL:', error);
      return '/placeholder.png';
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!products?.length) {
    return <div className="no-products">No products available</div>;
  }

  return (
    <div className="products-list">
      {products.map(product => (
        <Link 
          to={`/products/${product.id}`} 
          key={product.id}
          className="product-item"
        >
          <div className="product-image">
            <img 
              src={convertGoogleDriveUrl(product.thumbnailUrl)} 
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.png';
              }}
            />
          </div>
          <div className="product-content">
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">{product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Products;
