import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Remove unused imports
// import image1 from '../images/image1.png';
// import image2 from '../images/image2.png';

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

// Add ZoomableImage component
const ZoomableImage = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      className={`image-zoom-wrapper ${isZoomed ? 'zoomed' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      ref={imageRef}
    >
      <img 
        src={src} 
        alt={alt}
        className="product-main-image"
        style={isZoomed ? {
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
        } : undefined}
      />
    </div>
  );
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      } else {
        // Redirect to products page if product not found
        navigate('/products');
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="products-page">
      <div className="product-main">
        <div className="product-gallery">
          <ZoomableImage 
            src={product.galleryUrls[currentImageIndex] || product.thumbnailUrl} 
            alt={product.name} 
          />
          {product.galleryUrls.length > 0 && (
            <div className="product-thumbnails">
              {product.galleryUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.name} ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price}</p>
          <div className="product-description">
            {product.description}
          </div>
          <div className="product-specs">
            {product.specifications && Object.entries(product.specifications).map(([key, value]) => 
              value && (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              )
            )}
          </div>
          {product.care && (
            <div className="product-care">
              <h2>Care Instructions</h2>
              <p>{product.care}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
