import React, { useState, useEffect, useRef } from 'react';
import { Shield, Award, Users, Leaf } from 'lucide-react';
import '../style/landing.css';
import LandingPageFooter from './landingPageFooter.js';
import { Link } from 'react-router-dom';

const CountUp = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime;
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const Landing = () => {
  return (
    <div className="landing">
      <div className="landing-hero">
        <h1 className="landing-title">
          Do you want to <span className="highlight-text">Sell or Buy</span> Land?
        </h1>
        <p className="landing-subtitle">
          Find the perfect land for your needs or sell your property with ease
        </p>
        
        <div className="landing-buttons">
          <Link to="/sell" className="landing-btn sell-btn">
            <span className="btn-icon">💰</span>
            <span className="btn-text">
              <strong>Sell Land</strong>
              <small>List your property</small>
            </span>
          </Link>
          
          <Link to="/buy" className="landing-btn buy-btn">
            <span className="btn-icon">🏡</span>
            <span className="btn-text">
              <strong>Buy Land</strong>
              <small>Find your perfect plot</small>
            </span>
          </Link>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green">
              <Leaf size={32} />
            </div>
            <div className="stat-number">
              <CountUp end={50} duration={2000} suffix="+" />
            </div>
            <div className="stat-label">Premium Properties</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Users size={32} />
            </div>
            <div className="stat-number">
              <CountUp end={500} duration={2500} suffix="+" />
            </div>
            <div className="stat-label">Happy Clients</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cyan">
              <Award size={32} />
            </div>
            <div className="stat-number">
              <CountUp end={10} duration={1800} suffix="+" />
            </div>
            <div className="stat-label">Years Experience</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <Shield size={32} />
            </div>
            <div className="stat-number">
              <CountUp end={98} duration={2200} suffix="%" />
            </div>
            <div className="stat-label">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Why Choose Gem Realstate Section */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <div className="why-choose-content">
            <h2 className="section-title">Why Choose Gem Realstate?</h2>
            <p className="section-description">
              For over a decade, we've been connecting people with their perfect piece of nature. 
              Our commitment to excellence, transparency, and environmental stewardship sets us 
              apart in the land acquisition industry.
            </p>
            
            <div className="why-choose-grid">
              <div className="why-choose-card">
                <div className="why-icon-wrapper green">
                  <Shield size={24} />
                </div>
                <div className="why-text">
                  <h3>Trusted & Secure</h3>
                  <p>Every transaction is protected with the highest security standards. Your investment is safe with us.</p>
                </div>
              </div>

              <div className="why-choose-card">
                <div className="why-icon-wrapper green">
                  <Award size={24} />
                </div>
                <div className="why-text">
                  <h3>Premium Quality</h3>
                  <p>We carefully curate only the finest properties with pristine natural environments and clear titles.</p>
                </div>
              </div>

              <div className="why-choose-card">
                <div className="why-icon-wrapper green">
                  <Users size={24} />
                </div>
                <div className="why-text">
                  <h3>Expert Guidance</h3>
                  <p>Our experienced team provides personalized support throughout your land acquisition journey.</p>
                </div>
              </div>

              <div className="why-choose-card">
                <div className="why-icon-wrapper green">
                  <Leaf size={24} />
                </div>
                <div className="why-text">
                  <h3>Nature First</h3>
                  <p>We believe in sustainable development that preserves the natural beauty of the land.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="why-choose-image">
            <img src="/assests/gemlogof.jpg" alt="Gem Realstate" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">⭐ Real stories from people who found their perfect land</p>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Found my perfect mountain retreat through Gem Realstate. The process was seamless 
              and completely professional."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SJ</div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <p>Montana Landowner</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Exceptional service and truly beautiful properties. Highly recommend for anyone 
              looking for premium land investments."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MC</div>
              <div className="author-info">
                <h4>Michael Chen</h4>
                <p>Colorado Investor</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The team helped me find exactly what I was looking for. Great communication and 
              support throughout the entire process."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">ER</div>
              <div className="author-info">
                <h4>Emily Rodriguez</h4>
                <p>Vermont Homesteader</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <LandingPageFooter />
    </div>
  );
};

export default Landing;