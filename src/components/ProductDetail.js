import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import image1 from '../images/image1.png';
import image2 from '../images/image2.png';

// Helper function for Google Drive URLs
const convertGoogleDriveUrl = (url) => {
  if (!url) return '';
  try {
    // Remove any parameters from the URL
    const cleanUrl = url.split('?')[0];
    // Extract the file ID
    const fileId = cleanUrl.split('/file/d/')[1].split('/')[0];
    // Construct the direct download URL
    const directUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    console.log('Converting URL:', url, 'to:', directUrl); // Debug log
    return directUrl;
  } catch (error) {
    console.error('Error converting URL:', url, error);
    return url;
  }
};

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
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct({
          id: docSnap.id,
          ...data,
          thumbnailUrl: convertGoogleDriveUrl(data.thumbnailUrl),
          galleryUrls: (data.galleryUrls || []).map(url => convertGoogleDriveUrl(url))
        });
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>
      <img src={product.thumbnailUrl} alt={product.name} className="product-main-image" />
      <p className="product-price">{product.price}</p>
      <p className="product-description">{product.description}</p>
      {/* Add more product details as needed */}
    </div>
  );
}

export default ProductDetail;
