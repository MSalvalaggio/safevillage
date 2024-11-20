import React, { useState } from 'react';
import './ProjectsPage.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../images/logo512.png';

const ProjectsPage = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();

  // Function to handle navigation to home sections
  const navigateToHomeSection = (sectionId) => {
    navigate('/', { state: { scrollTo: sectionId } });
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <div className="projects-page">
      <nav className="projects-nav">
        <div className="nav-logo">
          <Link to="/">
            <img src={logo} alt="SafeVillage Logo" />
          </Link>
        </div>
        
        {/* Menu toggle button for mobile */}
        <button className={`menu-toggle ${isMenuVisible ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>

        <div className={`nav-menu ${isMenuVisible ? 'visible' : ''}`}>
          <button className="nav-link" onClick={() => navigateToHomeSection('home')}>
            Home
          </button>
          <button className="nav-link" onClick={() => navigateToHomeSection('project-build')}>
            Project
          </button>
          <button className="nav-link" onClick={() => navigateToHomeSection('video-section')}>
            Videos
          </button>
          <button className="nav-link" onClick={() => navigateToHomeSection('contact')}>
            Contact
          </button>
          <Link to="/login" className="nav-link nav-button">Login</Link>
        </div>
      </nav>

      <main className="projects-main">
        <header className="projects-header">
          <h1>Our Projects</h1>
          <p>Explore our collection of innovative solutions</p>
        </header>

        <section className="projects-grid">
          {/* Example project cards - replace with your actual projects */}
          <article className="project-card">
            <div className="project-image">
              <img src={require('../../images/main_project.png')} alt="Project 1" />
            </div>
            <div className="project-content">
              <h2>Project One</h2>
              <p>Description of the first project and its key features.</p>
              <button className="project-btn">Learn More</button>
            </div>
          </article>

          <article className="project-card">
            <div className="project-image">
              <img src={require('../../images/main_project.png')} alt="Project 2" />
            </div>
            <div className="project-content">
              <h2>Project Two</h2>
              <p>Description of the second project and its key features.</p>
              <button className="project-btn">Learn More</button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default ProjectsPage;
