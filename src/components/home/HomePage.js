import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@fontsource/bungee-hairline';
import '@fontsource/bai-jamjuree';
import '@fontsource/tinos';
import '@fontsource/montserrat';
import '@fontsource/montserrat/700.css'; // Bold weight
import '@fontsource/montserrat/600.css'; // Semi-bold weight
import './HomePage.css';
import logo from '../../images/logo512.png';
import { getLatestVideo, getChannelInfo } from '../../services/YouTubeService';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebase/config'; // Add storage import
import { ref, getDownloadURL } from 'firebase/storage';

const HomePage = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [latestVideo, setLatestVideo] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  // Updated Google Drive link conversion
  const convertDriveLink = (url) => {
    if (!url) return '';
    try {
      if (url.includes('drive.google.com')) {
        // Extract file ID from Google Drive URL
        const fileId = url.match(/[-\w]{25,}/);
        if (fileId) {
          // Use the direct image preview URL
          return `https://drive.google.com/thumbnail?id=${fileId[0]}&sz=w1000-h1000`;
        }
      }
      return url;
    } catch (error) {
      console.error('Error converting Drive link:', error);
      return '';
    }
  };

  // Memoize getImageUrl with useCallback
  const getImageUrl = useCallback(async (url) => {
    if (!url) return '';
    
    try {
      if (url.includes('drive.google.com')) {
        return convertDriveLink(url);
      }
      // Rest of the function remains the same
      if (url.startsWith('gs://') || url.startsWith('/')) {
        const storageRef = ref(storage, url);
        return await getDownloadURL(storageRef);
      }
      if (url.startsWith('http')) {
        return url;
      }
      return '';
    } catch (error) {
      console.error('Error getting image URL:', error, url);
      return '';
    }
  }, []);

  useEffect(() => {
    // Handle scroll events
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Handle initial scroll position
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        const videoData = await getLatestVideo('YourChannelUsername'); // Replace with your YouTube username
        const channelData = await getChannelInfo('YourChannelUsername'); // Replace with your YouTube username
        
        if (videoData) {
          setLatestVideo(videoData);
        }
        if (channelData) {
          setChannelInfo(channelData);
        }
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
      }
    };

    fetchYouTubeData();
  }, []);

  useEffect(() => {
    // Handle scroll to section when navigating from ProjectsPage
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, limit(3));
        const querySnapshot = await getDocs(q);

        const products = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imageUrl = await getImageUrl(data.thumbnailUrl);
          
          return {
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            price: data.price || '-',
            care: data.care || '',
            details: data.details || '',
            createdAt: data.createdAt || '',
            createdBy: data.createdBy || '',
            imageUrl: imageUrl || '',
            specifications: data.specifications || {}
          };
        }));

        setFeaturedProducts(products);
        
        // Initialize loading states for new products
        const initialLoadingStates = {};
        products.forEach(product => {
          initialLoadingStates[product.id] = true;
        });
        setLoadingStates(initialLoadingStates);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setFeaturedProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, [getImageUrl]);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setIsMenuVisible(false);
    }
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Simplify image loading handler
  const handleImageLoad = useCallback((productId) => {
    setLoadingStates(prev => ({
      ...prev,
      [productId]: false
    }));
  }, []);

  // Update handleImageError with proper dependencies
  const handleImageError = useCallback((productId) => {
    setLoadingStates(prev => ({
      ...prev,
      [productId]: false
    }));
  }, []);

  // Add image preloading effect
  useEffect(() => {
    featuredProducts.forEach(product => {
      if (product.imageUrl) {
        const img = new Image();
        img.onload = () => handleImageLoad(product.id);
        img.onerror = () => handleImageError(product.id);
        img.src = product.imageUrl;
      }
    });
  }, [featuredProducts, handleImageLoad, handleImageError]);

  return (
    <div className="home">
      <nav className={`hero-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="hero-logo">
          <Link to="/">
            <img src={logo} alt="SafeVillage Logo" />
          </Link>
        </div>
        
        <div className={`nav-menu ${isMenuVisible ? 'visible' : ''}`}>
          <button className="nav-link" onClick={() => scrollToSection('home')}>
            Home
          </button>
          <button className="nav-link" onClick={() => scrollToSection('project-build')}>
            Project
          </button>
          <button className="nav-link" onClick={() => scrollToSection('video-section')}>
            Videos
          </button>
          <button className="nav-link" onClick={() => scrollToSection('contact')}>
            Contact
          </button>
          <Link to="/login" className="nav-link nav-button">Login</Link>
        </div>

        <button className={`menu-toggle ${isMenuVisible ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
      </nav>

      <header className="hero" id="home">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="main-title">SafeVillage</span>
            <span className="studio">Studio</span>
          </h1>
        </div>
      </header>
      
      <main>
        <section className="project-build" id="project-build">
          <div className="project-build-content">
            <div className="project-build-left">
              <h2>Featured Products</h2>
              <div className="btn-container">
                <Link to="/products" className="project-build-btn">SEE THE COLLECTION</Link>
              </div>
            </div>
            <div className="featured-products-grid vertical-align">
              {featuredProducts.map((product) => (
                <Link 
                  to={`/products/${product.id}`} 
                  key={product.id} 
                  className={`featured-product-card ${loadingStates[product.id] ? 'loading' : ''}`}
                  style={{
                    backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '256px', // Changed from '320px' to '256px'
                  }}
                >
                  {loadingStates[product.id] && (
                    <div className="skeleton-loader"></div>
                  )}
                  {!product.imageUrl && (
                    <div className="image-placeholder">No image available</div>
                  )}
                  <div className="featured-product-info">
                    <h3>{product.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="video-section" id="video-section">
          <div className="video-content">
            <div className="video-text">
              <h2>
                {channelInfo ? channelInfo.snippet.title : 'Our YouTube Channel'}
              </h2>
              <p className="channel-description">
                {channelInfo ? channelInfo.snippet.description : 'Join us on YouTube where we share insights, tutorials, and updates about SafeVillage.'}
              </p>
              <a 
                href={`https://youtube.com/channel/${channelInfo?.id}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="youtube-btn"
              >
                Visit Our Channel
              </a>
            </div>
            <div className="video-player">
              {latestVideo && (
                <iframe
                  src={`https://www.youtube.com/embed/${latestVideo.id.videoId}`}
                  title={latestVideo.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <h2>Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Get in Touch</h3>
            </div>
            <form className="contact-form">
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Message"></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/">
              <img src={logo} alt="SafeVillage Logo" />
            </Link>
          </div>
          <div className="footer-links">
            <h4>Links</h4>
            <button onClick={() => scrollToSection('home')} className="footer-link">Home</button>
            <button onClick={() => scrollToSection('project-build')} className="footer-link">Project</button>
            <button onClick={() => scrollToSection('contact')} className="footer-link">Contact</button>
          </div>
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>          </div>        </div>        <div className="footer-bottom">          <p>&copy; {new Date().getFullYear()} SafeVillage. All rights reserved.</p>        </div>      </footer>
    </div>
  );
};

export default HomePage;
