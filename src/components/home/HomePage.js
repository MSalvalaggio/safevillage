import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@fontsource/bungee-hairline';
import '@fontsource/bai-jamjuree';
import '@fontsource/tinos';
import './HomePage.css';
import logo from '../../images/logo512.png';
import { getLatestVideo, getChannelInfo } from '../../services/YouTubeService';

const HomePage = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [latestVideo, setLatestVideo] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);

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
      const videoData = await getLatestVideo('YourChannelUsername'); // Replace with your YouTube username
      const channelData = await getChannelInfo('YourChannelUsername'); // Replace with your YouTube username
      
      if (videoData) {
        setLatestVideo(videoData);
      }
      if (channelData) {
        setChannelInfo(channelData);
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
          <h1>
            SafeVillage
            <span className="studio">Studio</span>
          </h1>
          <p className="hero-text">I'm making it</p>
        </div>
      </header>
      
      <main>
        <section className="project-build" id="project-build">
          <div className="project-build-content">
            <div className="project-build-image">
              <img src={require('../../images/main_project.png')} alt="Project Table" />
            </div>
            <div className="project-build-text">
              <h2>Project Build</h2>
              <p>Start building your project with our intuitive tools and workflows.</p>
              <div className="btn-container">
                <Link to="/products" className="project-build-btn">SEE THE COLLECTION</Link>
              </div>
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
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SafeVillage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
