document.addEventListener('DOMContentLoaded', () => {
  const YOUTUBE_API_KEY = 'AIzaSyBeLvIFmQjYt-AM9KBUqVUnYB60MrCVhHE'; // Inserisci qui la tua chiave API
  const CHANNEL_ID = 'UCHPszxtOERYU6gzWmBHytJQ'; // Inserisci qui l'ID del tuo canale
  
  // Effettua una richiesta all'API quando la pagina viene caricata
  fetch('/api/data')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Dati non in formato JSON!");
      }
      return response.json();
    })
    .then(data => {
      const messageElement = document.getElementById('message');
      if (messageElement) {
        messageElement.textContent = data.length > 0 ? data[0].message : 'Nessun dato disponibile';
      }
    })
    .catch(error => {
      console.error('Errore:', error);
      const messageElement = document.getElementById('message');
      if (messageElement) {
        messageElement.textContent = 'Errore nel caricamento dei dati';
      }
    });

  // Gestisci il click del bottone per recuperare il primo documento
  const fetchButton = document.getElementById('fetchFirstDocument');
  if (fetchButton) {
    fetchButton.addEventListener('click', () => {
      fetch('/api/data')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new TypeError("Dati non in formato JSON!");
          }
          return response.json();
        })
        .then(data => {
          const messageElement = document.getElementById('message');
          if (messageElement) {
            messageElement.textContent = data.length > 0 ? data[0].message : 'Nessun dato disponibile';
          }
        })
        .catch(error => {
          console.error('Errore:', error);
          const messageElement = document.getElementById('message');
          if (messageElement) {
            messageElement.textContent = 'Errore nel caricamento dei dati';
          }
        });
    });
  }

  // Gestisci l'invio del modulo di contatto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      if (nameInput && emailInput && messageInput) {
        console.log('Nome:', nameInput.value);
        console.log('Email:', emailInput.value);
        console.log('Messaggio:', messageInput.value);

        // Puoi aggiungere qui il codice per inviare i dati del modulo al server
      }
    });
  }

  // Add mobile menu toggle
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

  // Add event listener for youtubeVideo element
  const element = document.getElementById('youtubeVideo'); // or whatever selector you're using
  if (element) {
    element.addEventListener('click', function() {
      // Your event handler code
    });
  } else {
    console.warn('YouTube video element not found');
  }

  // Add smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
});