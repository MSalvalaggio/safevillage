import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Products.css';

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

// Add new ZoomableImage component
const ZoomableImage = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div 
      className={`image-zoom-wrapper ${isZoomed ? 'zoomed' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={imageRef}
    >
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      {hasError ? (
        <div className="image-error">
          <span>Impossibile caricare l'immagine</span>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt}
          className="product-main-image"
          style={isZoomed ? {
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          } : undefined}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

function Products() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          thumbnailUrl: convertGoogleDriveUrl(data.thumbnailUrl),
          galleryUrls: (data.galleryUrls || []).map(url => convertGoogleDriveUrl(url))
        };
      });
      if (products.length > 0) {
        setProduct({
          ...products[0],
          gallery: products[0].galleryUrls || [],
          specifications: {
            dimensions: products[0].specifications.dimensions || '',
            material: products[0].specifications.material || '',
            finish: products[0].specifications.finish || '',
            weight: products[0].specifications.weight || '',
            seating: products[0].specifications.seating || '',
            construction: products[0].specifications.construction || '',
            warranty: products[0].specifications.warranty || ''
          }
        });
        setRelatedProducts(products.slice(1));
      }
    };
    fetchProducts();
  }, []);

  // Function to handle image change
  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };



  if (!product) return <div>Loading...</div>;

  // Filtra solo le immagini valide
  const validGalleryUrls = product.galleryUrls.filter(url => url && url.trim() !== '');

  return (
    <section className="product-detail">
      <div className="product-main">
        <div className="product-gallery">
          <ZoomableImage 
            src={validGalleryUrls[currentImageIndex] || product.thumbnailUrl} 
            alt={product.name} 
          />
          {/* Mostra il carosello solo se ci sono più immagini */}
          {validGalleryUrls.length > 0 && (
            <div className="product-carousel">
              {validGalleryUrls.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleImageChange(index)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <div className="product-description">
            <p>{product.description}</p>
            <p>{product.details}</p>
          </div>
        </div>
      </div>

      <div className="product-additional-info">
        <div className="product-specs card">
          <h2>Technical Specifications</h2>
          <div className="specs-grid">
            {Object.entries(product.specifications).map(([key, value]) => (
              value && <div key={key} className="spec-item">
                <span className="spec-label">{key}</span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="product-care card">
          <h2>Care Instructions</h2>
          <p>{product.care}</p>
        </div>
      </div>

      {/* Add the carousel under the product section */}
      <div className="related-products">
        <h2>Prodotti Correlati</h2>
        <div className="product-grid">
          {relatedProducts.map((item) => (
            <div key={item.id} className="product-item">
              <img src={item.thumbnailUrl} alt={item.name} className="product-image" />
              <h3 className="product-name">{item.name}</h3>
              <p className="product-description">{item.description}</p>
              <Link to={`/products/${item.id}`} className="view-product-button">
                Visualizza Prodotto
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
