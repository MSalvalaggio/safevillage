import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource/bungee-hairline';
import '@fontsource/bai-jamjuree';
import './HomePage.css';
import logo from '../../images/logo512.png';

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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
          <button className="nav-link" onClick={() => scrollToSection('features')}>
            Features
          </button>
          <button className="nav-link" onClick={() => scrollToSection('about')}>
            About
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
          <p className="hero-text">Your trusted community for safe and secure living</p>
        </div>
      </header>
      
      <main>
        <section className="features" id="features">
          <h2>Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Community Safety</h3>
              <p>Stay connected with your neighborhood</p>
            </div>
            <div className="feature-card">
              <h3>Real-time Alerts</h3>
              <p>Get instant notifications about important events</p>
            </div>
            <div className="feature-card">
              <h3>Secure Access</h3>
              <p>Control who enters your community</p>
            </div>
          </div>
        </section>

        <section className="about" id="about">
          <div className="about-content">
            <h2>About Us</h2>
            <p>We are dedicated to creating safer communities through innovative technology and community engagement.</p>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>1000+</h3>
                <p>Communities Protected</p>
              </div>
              <div className="stat-card">
                <h3>24/7</h3>
                <p>Support Available</p>
              </div>
              <div className="stat-card">
                <h3>99%</h3>
                <p>Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <h2>Contact Us</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>Have questions? We're here to help!</p>
              <div className="contact-details">
                <p>Email: info@safevillage.com</p>
                <p>Phone: (555) 123-4567</p>
                <p>Address: 123 Safety Street, Secure City</p>
              </div>
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
            <img src={logo} alt="SafeVillage Logo" />
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <button onClick={() => scrollToSection('home')} className="footer-link">Home</button>
            <button onClick={() => scrollToSection('features')} className="footer-link">Features</button>
            <button onClick={() => scrollToSection('about')} className="footer-link">About</button>
            <button onClick={() => scrollToSection('contact')} className="footer-link">Contact</button>
          </div>
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SafeVillage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
