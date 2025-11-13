import React, { useState, useEffect, useRef } from 'react';
import { Shield, Award, Users, Leaf, MapPin } from 'lucide-react';
import '../style/landing.css';
import '../style/landing-urgent.css';
import LandingPageFooter from './landingPageFooter.js';
import { Link } from 'react-router-dom';
import siteContentService from '../services/content/siteContentService';

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

const Landing = ({ contentOverride = null }) => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (contentOverride) {
          setContent(contentOverride);
          return;
        }
        const res = await siteContentService.getPublicLanding();
        if (active) setContent(res.data || {});
      } catch (e) {
        // keep defaults by leaving content as null
      }
    };
    load();
    return () => { active = false; };
  }, [contentOverride]);

  const stats = content?.stats || { premium_properties: 50, happy_clients: 500, years_experience: 10, client_satisfaction: 98 };
  const features = content?.features || [];
  const testi = content?.testimonials || [];
  const images = content?.images || { why_image: '/assests/gemlogof.jpg' };
  const urgent = (content?.urgent_sales || []).slice(0,5);

  const formatINR = (val) => {
    if (val === undefined || val === null || val === '') return 'Contact for price';
    const num = Number(val);
    if (Number.isNaN(num)) return 'Contact for price';
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    } catch (e) {
      return `₹${num.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="landing">
      {/* Hero Banner Section */}

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

      {/* Urgent Sale Section */}
      {urgent.length > 0 && (
        <section className="urgent-section">
          <div className="urgent-header">
            <h2 className="section-title">Urgent Sale</h2>
            <p className="section-subtitle">Handpicked properties priced to move quickly. Limited availability.</p>
          </div>
          <div className="urgent-grid">
            {urgent.map((u, idx) => (
              <div key={idx} className="urgent-card">
                {u.image_url && (
                  <div className="urgent-image-wrap">
                    <img src={u.image_url} alt={u.title || 'Urgent Property'} />
                    <span className="urgent-badge">{(u.status || 'Available').toUpperCase()}</span>
                  </div>
                )}
                <div className="urgent-body">
                  <h3 className="urgent-title">{u.title || 'Property'}</h3>
                  {(u.location) && (
                    <div className="urgent-row"><MapPin size={16}/> <span>{u.location}</span></div>
                  )}
                  {u.size_text && (<div className="urgent-size">{u.size_text}</div>)}
                  {u.description && (<p className="urgent-desc">{u.description}</p>)}
                  <div className="urgent-footer">
                    <div className="urgent-price">{formatINR(u.price)}</div>
                    <div className="urgent-actions">
                      <Link to={u.land_id ? `/land/${u.land_id}` : '/buy'} className="urgent-btn">View Details</Link>
                      <a
                        className="urgent-btn wa"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://wa.me/919894351011?text=${encodeURIComponent(`I'm interested in this property: ${u.title || 'Property'}${u.location ? ' - ' + u.location : ''}. Details: ${typeof window!== 'undefined' ? window.location.origin : ''}${u.land_id ? '/land/'+u.land_id : '/buy'}`)}`}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      </div>
      
      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green">
              <Leaf size={32} />
            </div>
            <div className="stat-number">
              <CountUp end={Number(stats.premium_properties) || 0} duration={2000} suffix={"+"} />
            </div>
            <div className="stat-label">Premium Properties</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Users size={32} />
            </div>
            <div className="stat-number">
              <CountUp end={Number(stats.happy_clients) || 0} duration={2500} suffix={"+"} />
            </div>
            <div className="stat-label">Happy Clients</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cyan">
              <Award size={32} />
            </div>
            <div className="stat-number">
              <CountUp end={Number(stats.years_experience) || 0} duration={1800} suffix={"+"} />
            </div>
            <div className="stat-label">Years Experience</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <Shield size={32} />
            </div>
            <div className="stat-number">
              <CountUp end={Number(stats.client_satisfaction) || 0} duration={2200} suffix={"%"} />
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
                  <p>{features[0]?.text || 'Every transaction is protected with the highest security standards. Your investment is safe with us.'}</p>
                </div>
              </div>

              <div className="why-choose-card">
                <div className="why-icon-wrapper green">
                  <Award size={24} />
                </div>
                <div className="why-text">
                  <h3>Premium Quality</h3>
                  <p>{features[1]?.text || 'We carefully curate only the finest properties with pristine natural environments and clear titles.'}</p>
                </div>
              </div>

              <div className="why-choose-card">
                <div className="why-icon-wrapper green">
                  <Users size={24} />
                </div>
                <div className="why-text">
                  <h3>Expert Guidance</h3>
                  <p>{features[2]?.text || 'Our experienced team provides personalized support throughout your land acquisition journey.'}</p>
                </div>
              </div>

              <div className="why-choose-card">
                <div className="why-icon-wrapper green">
                  <Leaf size={24} />
                </div>
                <div className="why-text">
                  <h3>Nature First</h3>
                  <p>{features[3]?.text || 'We believe in sustainable development that preserves the natural beauty of the land.'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="why-choose-image">
            <img src={images.why_image || '/assests/gemlogof.jpg'} alt="Gem Realstate" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">⭐ Real stories from people who found their perfect land</p>
        
        <div className="testimonials-grid">
          {(testi.length ? testi : [
            { initials: 'SJ', name: 'Sarah Johnson', title: 'Montana Landowner', text: 'Found my perfect mountain retreat through Gem Realstate. The process was seamless and completely professional.', stars: 5 },
            { initials: 'MC', name: 'Michael Chen', title: 'Colorado Investor', text: 'Exceptional service and truly beautiful properties. Highly recommend for anyone looking for premium land investments.', stars: 5 },
            { initials: 'ER', name: 'Emily Rodriguez', title: 'Vermont Homesteader', text: 'The team helped me find exactly what I was looking for. Great communication and support throughout the entire process.', stars: 5 },
          ]).map((t, idx) => (
            <div className="testimonial-card" key={idx}>
              <div className="stars">{'⭐'.repeat(t.stars || 5)}</div>
              <p className="testimonial-text">{`"${t.text}"`}</p>
              <div className="testimonial-author">
                {t.avatar_url ? (
                  <img className="author-avatar" src={t.avatar_url} alt={t.name} />
                ) : (
                  <div className="author-avatar">{t.initials || (t.name ? t.name.substring(0,2).toUpperCase() : 'NA')}</div>
                )}
                <div className="author-info">
                  <h4>{t.name}</h4>
                  <p>{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <LandingPageFooter instagram={content?.instagram} />
    </div>
  );
};

export default Landing;