import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [channelInfo, setChannelInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const YOUTUBE_API_KEY = 'AIzaSyBeLvIFmQjYt-AM9KBUqVUnYB60MrCVhHE';
  const CHANNEL_ID = 'UCHPszxtOERYU6gzWmBHytJQ';

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

        // Fetch videos
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${YOUTUBE_API_KEY}`
        );
        const videosData = await videosResponse.json();
        
        if (videosData.items?.length > 0) {
          // Filter out Shorts videos
          const nonShortsVideos = videosData.items.filter(video => 
            !video.snippet.title.toLowerCase().includes('#shorts')
          ).slice(0, 4); // Only take first 4 non-Shorts videos

          setVideos(nonShortsVideos);
        }
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
      }
    };

    fetchYouTubeData();
  }, []);

  return (
    <div className="App">
      <nav className="main-nav">
        <div className="nav-logo">
          <a href="#home">
            <img src="/images/logo.jpg" alt="Artisan Tables Logo" className="logo-image" />
          </a>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#youtube">Videos</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="mobile-menu" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <header className="hero" id="home">
        <h1>SafeVillage Studio - Handcrafted Furniture in Milan, Italy</h1>
        <p>Artisanal Woodworking & Custom Furniture Design</p>
      </header>

      <section className="about" id="about">
        <h2>About Our Milan Workshop</h2>
        <div className="about-content">
          <img 
            src="/images/artisan-woodworker-milan-workshop.jpg" 
            alt="Master woodworker crafting furniture in Milan workshop" 
            className="about-image"
            loading="lazy"
          />
          <p>From our workshop in the heart of Milan, we create bespoke furniture pieces that combine traditional Italian craftsmanship with modern design.</p>
        </div>
      </section>

      <section className="products" id="products">
        <h2>Our Handcrafted Collection</h2>
        <div className="product-grid">
          <div className="product-card">
            <img 
              src="/images/handcrafted-oak-dining-table-milan.jpg" 
              alt="Handcrafted solid oak dining table made in Milan" 
              loading="lazy"
            />
            <h3>Tuscan Oak Dining Table</h3>
            <p>Elegant solid oak dining table handcrafted in Milan. Features traditional Italian joinery and natural finish.</p>
            <p className="product-specs">Dimensions: 180x90cm • Solid Oak • Made in Milan</p>
          </div>
          {/* Add more product cards as needed */}
        </div>
      </section>

      <section className="youtube-section" id="youtube">
        <h2>Workshop Videos</h2>
        <div className="youtube-container">
          {channelInfo && videos.length > 0 && (
            <div className="youtube-layout">
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
              
              <div className="featured-video">
                <iframe 
                  src={`https://www.youtube.com/embed/${videos[0].id.videoId}`}
                  title="Video in evidenza"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </section>

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

      <footer>
        <p>Contact me for custom orders</p>
        <div className="social-links">
          <a href="https://youtube.com/safevillagestudio" target="_blank" rel="noopener noreferrer">YouTube</a>
          {/* Add more social links */}
        </div>
      </footer>
    </div>
  );
}

export default App;
