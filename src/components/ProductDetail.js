import React from 'react';
import { useParams } from 'react-router-dom';
import image1 from '../images/image1.png';
import image2 from '../images/image2.png';

// Temporary placeholder for images
const PlaceholderImage = () => (
  <div style={{ 
    width: '100%', 
    height: '300px', 
    background: '#1e2229',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#F4D59E',
    border: '1px solid #B27148',
    borderRadius: '12px'
  }}>
    Image Placeholder
  </div>
);

function ProductDetail() {
  const { id } = useParams(); // Get the product ID from the URL

  // Define your products data
  const products = [
    {
      id: '1',
      name: 'Venetian Glass Coffee Table',
      image: image1, // Make sure to import image1
      price: '€800',
      description: 'Crafted with Venetian glass, this coffee table is a masterpiece.',
      // ...other properties...
    },
    {
      id: '2',
      name: 'Florentine Walnut Sideboard',
      image: image2, // Make sure to import image2
      price: '€1,500',
      description: 'An exquisite walnut sideboard from Florence.',
      // ...other properties...
    },
    // Add more products as needed
  ];

  // Find the product with the matching ID
  const product = products.find((product) => product.id === id);

  if (!product) {
    return <div>Prodotto non trovato</div>;
  }

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} className="product-main-image" />
      <p className="product-price">{product.price}</p>
      <p className="product-description">{product.description}</p>
      {/* ...existing code... */}
    </div>
  );
}

export default ProductDetail;
