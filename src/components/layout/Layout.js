import React from 'react';

export const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="header">
        <nav className="main-nav">
          {/* Navigation links will go here */}
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        {/* Add your footer content here */}
      </footer>
    </div>
  );
};

export default Layout;