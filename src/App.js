import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import logo from './images/logo.jpg';
import artisanWorkshop from './images/artisan-woodworker-milan-workshop.png';
import diningTable from './images/handcrafted-oak-dining-table-milan.png';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail'; // Import the ProductDetail component
import AdminProducts from './components/AdminProducts'; // Import the AdminProducts component
// Add more product images imports here

function App() {
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showYoutube, setShowYoutube] = useState(true); // Always show YouTube section
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
  console.log('YOUTUBE_API_KEY:', YOUTUBE_API_KEY);
  const CHANNEL_ID = 'UCHPszxtOERYU6gzWmBHytJQ';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const isAdmin = user?.uid === "1ph4IGD1DTY4rXUct7kBrnYAWdD3";

  const products = [
    {
      image: diningTable,
      title: "Tuscan Oak Dining Table",
      description: "Elegant solid oak dining table handcrafted in Milan. Features traditional Italian joinery and natural finish.",
      specs: "Dimensions: 180x90cm • Solid Oak • Made in Milan"
    },
    // Add more products here with similar structure
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        // Fetch channel info
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
        );
        const channelData = await channelResponse.json();
        if (channelData.items?.length > 0) {
          setChannelInfo(channelData.items[0]);
        }

        // Fetch only one video
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&order=date&type=video&key=${YOUTUBE_API_KEY}`
        );
        const videosData = await videosResponse.json();
        
        if (videosData.items?.length > 0) {
          setVideos(videosData.items);
        }
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
      }
    };

    fetchYouTubeData();
  }, []);

  useEffect(() => {
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu && navLinks) {
      mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });

      // Close mobile menu when clicking a link
      const navItems = document.querySelectorAll('.nav-links a');
      navItems.forEach(item => {
        item.addEventListener('click', () => {
          navLinks.classList.remove('active');
          mobileMenu.classList.remove('active');
        });
      });
    }

    // Smooth scrolling only for anchor links (not route links)
    document.querySelectorAll('a[href^="#"]:not([href*="/"])').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }, []); // Empty dependency array means this runs once on mount

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
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/" onClick={() => scrollToSection('youtube')}>Videos</Link></li>
            <li><Link to="/" onClick={() => scrollToSection('contact')}>Contact</Link></li>
            {isAdmin && (
              <li><Link to="/admin/products">Admin Panel</Link></li>
            )}
            {user ? (
              <li>
                <button onClick={() => signOut(auth)}>Logout</button>
              </li>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li> {/* Fixed: Added closing tag */}
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

                <section className="products" id="products">
                  <h2>Our Handcrafted Collection</h2>
                  <div className="carousel-container">
                    <button className="carousel-button prev" onClick={prevSlide} aria-label="Previous product">
                      ←
                    </button>
                    
                    <div className="carousel-content">
                      {products.map((product, index) => (
                        <div 
                          key={index}
                          className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                          style={{ transform: `translateX(${100 * (index - currentSlide)}%)` }}
                        >
                          <div className="product-card">
                            <img 
                              src={product.image}
                              alt={product.title}
                              loading="lazy"
                            />
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                            <p className="product-specs">{product.specs}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="carousel-button next" onClick={nextSlide} aria-label="Next product">
                      →
                    </button>

                    <div className="carousel-indicators">
                      {products.map((_, index) => (
                        <button
                          key={index}
                          className={`indicator ${index === currentSlide ? 'active' : ''}`}
                          onClick={() => setCurrentSlide(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {showYoutube && (
                  <section className="youtube-section" id="youtube">
                    <h2>Workshop Videos</h2>
                    <div className="youtube-container">
                      {!channelInfo && !videos.length ? (
                        <p>Loading videos...</p>
                      ) : channelInfo && videos.length > 0 ? (
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
                      ) : (
                        <p>No videos available</p>
                      )}
                    </div>
                  </section>
                )}

                <section className="contact" id="contact">
                  <h2>Contact Our Milan Studio</h2>
                  <form id="contactForm" className="contact-form">
                    <div className="form-group">
                      <label htmlFor="name">Name:</label>
                      <input type="text" id="name" name="name" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message:</label>
                      <textarea id="message" name="message" required></textarea>
                    </div>
                    <button type="submit">Send Message</button>
                  </form>
                </section>
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
  );
}

export default App;
