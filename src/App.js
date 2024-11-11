import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import logo from './images/logo.jpg';
import artisanWorkshop from './images/artisan-woodworker-milan-workshop.png';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import AdminProducts from './components/AdminProducts';
import { ProductProvider, useProducts } from './context/ProductContext';
import Admin from './components/Admin';
// Remove these imports
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from './firebase';
// Add more product images imports here

const CHANNEL_ID = 'UCHPszxtOERYU6gzWmBHytJQ';
const ADMIN_UID = process.env.REACT_APP_ADMIN_UID;

function convertGoogleDriveUrl(url) {
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
}

function FeaturedProducts() {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate(); // Add this hook

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!products?.length) return <div className="no-products">No products available</div>;

  // Take only first 4 products
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="featured-products" id="products">
      <h2>Featured Products</h2>
      <div className="featured-grid">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
            className="featured-product-card"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/products/${product.id}`);
              }
            }}
          >
            <img 
              src={convertGoogleDriveUrl(product.thumbnailUrl)} 
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.png';
              }}
            />
            <div className="featured-product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showYoutube] = useState(true); // Added showYoutube state
  const [user, setUser] = useState(null);
  const isAdmin = user?.uid === ADMIN_UID;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Remove products array since it's now in ProductContext

  useEffect(() => {
    const fetchYouTubeData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Debug environment variables
        console.log('Environment variables:', {
          YOUTUBE_API_KEY: process.env.REACT_APP_YOUTUBE_API_KEY,
          NODE_ENV: process.env.NODE_ENV
        });

        const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
        
        if (!apiKey) {
          throw new Error('YouTube API key is not configured');
        }

        const baseUrl = 'https://www.googleapis.com/youtube/v3';
        
        // Fetch channel info
        const channelUrl = `${baseUrl}/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${apiKey}`;
        console.log('Fetching from URL:', channelUrl);
        
        const channelResponse = await fetch(channelUrl);
        
        if (!channelResponse.ok) {
          const errorData = await channelResponse.json();
          throw new Error(
            `Channel HTTP error! status: ${channelResponse.status}, message: ${JSON.stringify(errorData)}`
          );
        }
        
        const channelData = await channelResponse.json();
        if (channelData.items?.length > 0) {
          setChannelInfo(channelData.items[0]);
        }

        // Fetch videos
        const videosResponse = await fetch(
          `${baseUrl}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&order=date&type=video&key=${apiKey}`
        );
        
        if (!videosResponse.ok) {
          const errorData = await videosResponse.json();
          throw new Error(
            `Videos HTTP error! status: ${videosResponse.status}, message: ${JSON.stringify(errorData)}`
          );
        }
        
        const videosData = await videosResponse.json();
        if (videosData.items?.length > 0) {
          setVideos(videosData.items);
        }
      } catch (error) {
        console.error('Error fetching YouTube data:', error.message);
        setError(error.message);
        setChannelInfo(null);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have both required values
    if (CHANNEL_ID && process.env.REACT_APP_YOUTUBE_API_KEY) {
      fetchYouTubeData();
    } else {
      setError('Missing required configuration (CHANNEL_ID or API key)');
    }
  }, [CHANNEL_ID]); // Remove YOUTUBE_API_KEY from dependencies since we're using process.env directly

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Add this function to handle smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add this component for protected routes
  const ProtectedRoute = ({ children }) => {
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <ProductProvider>
      <Router>
        <div className="App">
          <nav className="main-nav">
            <div className="nav-logo">
              <Link to="/">
                <img
                  src={logo}
                  alt="Artisan Tables Logo"
                  className="logo-image"
                />
              </Link>
            </div>
            <ul className="nav-links">
              <li><Link to="/" onClick={() => scrollToSection('home')}>Home</Link></li>
              <li><Link to="/" onClick={() => scrollToSection('about')}>About</Link></li>
              <li><Link to="/" onClick={() => scrollToSection('products')}>Featured Products</Link></li>
              <li><Link to="/" onClick={() => scrollToSection('youtube')}>Videos</Link></li>
              <li><Link to="/" onClick={() => scrollToSection('contact')}>Contact</Link></li>
              {user ? (
                <>
                  {isAdmin && (
                    <li><Link to="/admin">Admin Dashboard</Link></li>
                  )}
                  <li>
                    <button onClick={() => signOut(auth)}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/signup">Signup</Link></li>
                </>
              )}
            </ul>
            <button className="mobile-menu" aria-label="Menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <>
                  <header className="hero" id="home">
                    <img 
                      src={artisanWorkshop} 
                      alt="SafeVillage Studio Workshop" 
                      className="hero-image"
                    />
                    <div className="hero-content">
                      <h1>SafeVillage Studio</h1>
                      <p>Artisanal Woodworking & Custom Furniture Design</p>
                    </div>
                  </header>

                  <section className="about" id="about">
                    <div className="about-content">
                      <div className="about-text">
                        <h2>About Our Milan Workshop</h2>
                        <p>
                          In the heart of Milan's artisan district, our workshop is where traditional Italian craftsmanship meets contemporary design. With over a decade of experience, we specialize in creating bespoke wooden furniture that tells a unique story.
                        </p>
                        <p>
                          Each piece is meticulously handcrafted using select hardwoods and time-honored joinery techniques, ensuring both beauty and longevity. Our commitment to sustainable practices means we source local materials and minimize waste through careful planning.
                        </p>
                        <p>
                          From custom dining tables to unique home accessories, every creation reflects our passion for woodworking and attention to detail. We work closely with clients to bring their vision to life, creating pieces that will be cherished for generations.
                        </p>
                      </div>
                      <img 
                        src={artisanWorkshop}
                        alt="Master woodworker crafting furniture in Milan workshop" 
                        className="about-image"
                        loading="lazy"
                      />
                    </div>
                  </section>

                  <FeaturedProducts />

                  {showYoutube && (
                    <section className="youtube-section" id="youtube">
                      <h2>Workshop Videos</h2>
                      <div className="youtube-container">
                        {isLoading ? (
                          <p>Loading videos...</p>
                        ) : error ? (
                          <p>Error: {error}</p>
                        ) : !channelInfo && !videos.length ? (
                          <p>No videos available</p>
                        ) : (
                          <div className="youtube-layout">
                            <div className="featured-video">
                              <iframe
                                src={`https://www.youtube.com/embed/${videos[0].id.videoId}`}
                                title={videos[0].snippet.title}
                                allowFullScreen
                              />
                            </div>
                            <div className="channel-info">
                              <p className="channel-description">{channelInfo.snippet.description}</p>
                              <div className="channel-stats">
                                <div className="stat">
                                  <span className="stat-number">{Number(channelInfo.statistics.subscriberCount).toLocaleString()}</span>
                                  <span className="stat-label">Iscritti</span>
                                </div>
                                <div className="stat">
                                  <span className="stat-number">{Number(channelInfo.statistics.videoCount).toLocaleString()}</span>
                                  <span className="stat-label">Video</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </>
              } />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute>
                    <AdminProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* Add other routes as needed */}
            </Routes>
          </main>

          <footer>
            <p>Contact me for custom orders</p>
            <div className="social-links">
              <a href="https://youtube.com/@SafeVillageStudio" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://instagram.com/safevillagestudio" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://facebook.com/safevillagestudio" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://tiktok.com/@safevillagestudio" target="_blank" rel="noopener noreferrer">TikTok</a>
              <a href="https://threads.net/@safevillagestudio" target="_blank" rel="noopener noreferrer">Threads</a>
            </div>
          </footer>
        </div>
      </Router>
    </ProductProvider>
  );
}

export default App;
