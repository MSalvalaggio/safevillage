import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import logo from '../../images/logo512.png';

const ADMIN_UID = process.env.REACT_APP_ADMIN_UID;

function Navbar() {
  const [user, setUser] = useState(null);
  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="main-nav">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="SafeVillage Studio Logo" className="logo-image" />
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
  );
}

export default Navbar;
