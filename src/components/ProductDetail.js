import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext'; // Make sure you have this context

function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts(); // Get products from context instead of hardcoding

  // Add debug logging
  useEffect(() => {
    console.log('Product ID from URL:', id);
    console.log('Available products:', products);
  }, [id, products]);

  const product = products.find(p => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Prodotto non trovato</h2>
        <p>Il prodotto che stai cercando non è disponibile.</p>
      </div>
    );
  }

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
        
        if (fileId) {
          // Usando il formato thumbnail che è più affidabile
          return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }
      }
      return url;
    } catch (error) {
      console.error('Error converting URL:', error);
      return '/placeholder.png';
    }
  };

  return (
    <div className="product-detail container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="product-image">
            <img 
              src={convertGoogleDriveUrl(product.thumbnailUrl)} 
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.png';
              }}
              loading="lazy"
            />
          </div>
          <div className="product-info">
            <p className="text-2xl font-semibold mb-4">{product.price}</p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            {product.details && (
              <div className="product-details mb-6">
                {Object.entries(product.details).map(([key, value]) => (
                  <p key={key} className="mb-2">
                    <span className="font-semibold">{key}: </span>
                    {value}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
