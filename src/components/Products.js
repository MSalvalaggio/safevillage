import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStorage, ref, getDownloadURL, listAll } from 'firebase/storage';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import diningTable from '../images/handcrafted-oak-dining-table-milan.png';
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

// Add new ZoomableImage component
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

function Products() {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const storage = getStorage();
        const db = getFirestore();

        // Get product data from Firestore
        const productDoc = await getDoc(doc(db, 'products', 'tuscan-oak-table'));
        const productData = productDoc.data();

        // Get product images from Storage
        const imagesRef = ref(storage, `products/${productData.id}/gallery`);
        const imagesList = await listAll(imagesRef);
        const imageUrls = await Promise.all(
          imagesList.items.map(imageRef => getDownloadURL(imageRef))
        );

        // Get related products
        const relatedProductsSnapshot = await getDocs(collection(db, 'products'));
        const relatedProductsData = [];
        for (const doc of relatedProductsSnapshot.docs) {
          const data = doc.data();
          const thumbnailRef = ref(storage, `products/${doc.id}/thumbnail.jpg`);
          const thumbnailUrl = await getDownloadURL(thumbnailRef);
          relatedProductsData.push({
            id: doc.id,
            ...data,
            image: thumbnailUrl
          });
        }

        setProduct({
          ...productData,
          gallery: imageUrls
        });
        setRelatedProducts(relatedProductsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading product data:', error);
        setLoading(false);
      }
    };

    loadProductData();
  }, []);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.gallery.length - 1 : prev - 1
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <section className="product-detail">
      <div className="product-main">
        <div className="product-gallery">
          <ZoomableImage 
            src={product.gallery[currentImageIndex]} 
            alt={product.name} 
          />
          {/* Carousel of thumbnails */}
          <div className="product-carousel">
            {product.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => handleImageChange(index)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price}</p>
          <div className="product-description">
            <p>{product.description}</p>
            <p>{product.details}</p>
          </div>
          <button className="add-to-cart-button">Aggiungi al Carrello</button>
        </div>
      </div>

      <div className="product-additional-info">
        <div className="product-specs card">
          <h2>Technical Specifications</h2>
          <div className="specs-grid">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="spec-item">
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
        <div className="product-carousel">
          {relatedProducts.map((item) => (
            <div key={item.id} className="carousel-item">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="product-price">{item.price}</p>
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
