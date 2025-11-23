import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./index.css";

export default function LandingPage() {
  const { isAuthenticated, isLoadingAuth, logout } = useAuth();
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const contactRef = useRef(null);
  const lastScrollY = useRef(0);

<<<<<<< HEAD
  // images array 
=======
>>>>>>> 18ea90f (Inital commit)
  const images = React.useMemo(() => [
    require("../images/tel1.jpg"),
    require("../images/tel2.jpg"),
    require("../images/tel3.jpg"),
    require("../images/tel4.jpg"),
    require("../images/tel6.jpg"),
    require("../images/tel7.png")
  ], []);

  useEffect(() => {
    const shuffled = [...images].sort(() => Math.random() - 0.5);
  }, [images]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const atBottom = current + windowHeight >= docHeight - 50;

      if (atBottom) {
        setShowNavbar(true);
      } else if (current > lastScrollY.current && current > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout, navigate]);

  const handleScrollToContact = useCallback(() => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "center"
      });
    }
  }, []);

  const handleContactSubmit = useCallback((e) => {
    e.preventDefault();
    console.log("Contact form submitted");
    setShowContact(false);
  }, []);

  const bgImage = images[index];

  if (isLoadingAuth) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`navbar ${!showNavbar ? "hidden" : ""}`}>
        <div className="nav-left" />
        <div className="logo">
          DelTech<span className="accent">Networks</span>
        </div>
        <div className="nav-buttons">
          <button className="nav-btn outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: bgImage
            ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${bgImage})`
            : "none",
        }}
      >
        <div className="hero-content">
          <h1 className="animate-fade">DelTech Networks</h1>
          <p className="animate-fade-delay">
            Empowering Kenya's digital future with high-speed internet, fiber networks
            and wireless infrastructure.
          </p>
          <div className="hero-buttons animate-pop">
            <button onClick={handleScrollToContact}>Get Connected</button>
            <button 
              className="secondary" 
              onClick={() => setShowContact(true)}
              aria-label="Contact Us"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="flex-section glass-section">
        <div className="text-block fade-in">
          <h2>About DelTech Networks</h2>
          <p>
            Kenyan-based telecommunications provider delivering world-class internet and
            digital connectivity solutions for homes, schools and enterprises.
          </p>
        </div>
        <img
          src={images[1]} 
          alt="Technicians at work"
          className="section-image tilt"
          loading="lazy"
        />
      </section>

      {/* Services Section */}
      <section className="services-section glass-section">
        <h2 className="fancy-header">Our Core Services</h2>
        <div className="services-grid">
          <ServiceCard 
            title="Fiber Broadband" 
            desc="Uninterrupted, ultra-fast fiber internet for homes and enterprises." 
          />
          <ServiceCard 
            title="Wireless Internet" 
            desc="High-speed wireless coverage for urban and rural Kenya." 
          />
          <ServiceCard 
            title="Enterprise Connectivity" 
            desc="Dedicated network solutions for businesses, schools and institutions." 
          />
          <ServiceCard 
            title="VoIP Communication" 
            desc="Affordable and clear VoIP systems for reliable voice communication." 
          />
          <ServiceCard 
            title="Infrastructure Leasing" 
            desc="Access to towers, ducts and dark fiber across Kenya's telecom grid." 
          />
          <ServiceCard 
            title="IT & Managed Services" 
            desc="Network design, deployment and maintenance from certified engineers." 
          />
        </div>
      </section>

      {/* Coverage Section */}
      <section ref={contactRef} className="flex-section gradient-section reverse">
        <div className="text-block fade-in">
          <h2>Nationwide Coverage</h2>
          <p>
            Our network connects Kenya end-to-end — coastal towns like Mombasa to inland
            hubs like Eldoret and Kisumu.
          </p>
          <ul>
            <li><strong>Urban Fiber:</strong> Nairobi, Nakuru, Kisumu, Mombasa.</li>
            <li><strong>Rural Wireless:</strong> Coverage for remote schools and health centers.</li>
            <li><strong>Satellite Links:</strong> For hard-to-reach regions across Rift Valley and Northern Kenya.</li>
          </ul>
        </div>
        <img
          src={images[2]}
          alt="Coverage Map"
          className="section-image tilt"
          loading="lazy"
        />
      </section>

      {/* CTA Section */}
      <section className="cta-section glass-section">
        <div className="text-block fade-in">
          <h2>Let's Connect You</h2>
          <p>Partner with DelTech and experience true high-speed connectivity wherever you are.</p>
          <button onClick={() => setShowContact(true)}>Contact Us</button>
        </div>
      </section>

      {/* Contact Modal */}
      {showContact && (
        <Modal onClose={() => setShowContact(false)} title="Get in Touch">
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="input-group">
              <input type="text" placeholder=" " required aria-label="Full Name" />
              <label>Full Name</label>
            </div>
            <div className="input-group">
              <input type="email" placeholder=" " required aria-label="Email Address" />
              <label>Email Address</label>
            </div>
            <div className="input-group">
              <input type="tel" placeholder=" " aria-label="Phone Number" />
              <label>Phone Number</label>
            </div>
            <div className="input-group">
              <textarea placeholder=" " rows="4" required aria-label="Your Message" />
              <label>Your Message</label>
            </div>
            <button type="submit" className="contact-submit">Send Message</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* Reusable Components */
const ServiceCard = React.memo(({ title, desc }) => {
  return (
    <div className="service-card pop">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const Modal = React.memo(({ title, children, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button 
            className="modal-close-x" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';
