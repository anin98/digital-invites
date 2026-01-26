import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './BirthdayInvite.css';

gsap.registerPlugin(ScrollTrigger);

// Lottie animation URLs
const LOTTIE_ANIMATIONS = {
  confetti: 'https://lottie.host/5e2bb472-17e1-46b8-bad2-3702283112aa/mQ5IEU0Kvk.lottie',
};

// Background theme options
const THEMES = [
  { id: 'elegant-gold', name: 'Elegant Gold', primary: '#d4af37', secondary: '#b8860b', bg: 'linear-gradient(180deg, #0d0d0d 0%, #1a1215 50%, #0d0d0d 100%)' },
  { id: 'rose-gold', name: 'Rose Gold', primary: '#e8b4b8', secondary: '#d4a5a5', bg: 'linear-gradient(180deg, #1a1012 0%, #2d1f24 50%, #1a1012 100%)' },
  { id: 'royal-purple', name: 'Royal Purple', primary: '#9b59b6', secondary: '#8e44ad', bg: 'linear-gradient(180deg, #0d0d15 0%, #1a1525 50%, #0d0d15 100%)' },
  { id: 'ocean-blue', name: 'Ocean Blue', primary: '#5dade2', secondary: '#3498db', bg: 'linear-gradient(180deg, #0a1520 0%, #152535 50%, #0a1520 100%)' },
  { id: 'emerald', name: 'Emerald', primary: '#2ecc71', secondary: '#27ae60', bg: 'linear-gradient(180deg, #0a150d 0%, #152a1a 50%, #0a150d 100%)' },
];

const FREE_TIER_LIMIT = 30;

const BirthdayInvite = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Customization state
  const [celebrantName, setCelebrantName] = useState("Sarah");
  const [eventSubtitle, setEventSubtitle] = useState("An Evening of Elegance & Celebration");
  const [eventDate, setEventDate] = useState("2026-12-25");
  const [eventTime, setEventTime] = useState("19:00");
  const [venueName, setVenueName] = useState("The Grand Ballroom");
  const [venueAddress, setVenueAddress] = useState("123 Celebration Avenue, NYC");
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [guestCount, setGuestCount] = useState(30);
  const [showCustomizer, setShowCustomizer] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate().toString(),
      month: date.toLocaleString('default', { month: 'long' }),
      year: date.getFullYear().toString()
    };
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    const [hours] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'evening' : 'morning';
    const displayHour = hour % 12 || 12;
    const timeWords: Record<number, string> = {
      1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six',
      7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve'
    };
    return `${timeWords[displayHour] || displayHour} o'clock in the ${ampm}`;
  };

  const dateDisplay = formatDate(eventDate);

  // Generate invitation link
  const generateLink = () => {
    if (guestCount > FREE_TIER_LIMIT) {
      alert(`Free tier allows only ${FREE_TIER_LIMIT} guests. Please upgrade to invite more!`);
      return;
    }

    const inviteData = {
      name: celebrantName,
      subtitle: eventSubtitle,
      date: eventDate,
      time: eventTime,
      venue: venueName,
      address: venueAddress,
      theme: selectedTheme.id,
      guests: guestCount
    };

    const encodedData = btoa(JSON.stringify(inviteData));
    const link = `${window.location.origin}/invite/${encodedData}`;
    setGeneratedLink(link);
    setShowLinkModal(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link copied to clipboard!');
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Hero gradient reveal
      tl.fromTo('.hero-gradient',
        { opacity: 0, scale: 1.3 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
      );

      // Confetti entrance
      tl.fromTo('.confetti-decoration',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'elastic.out(1, 0.5)' },
        '-=1.5'
      );

      // Title animation
      tl.fromTo('.invite-title .char',
        { y: 120, opacity: 0, rotateX: -90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.04, ease: 'back.out(1.7)' },
        '-=0.8'
      );

      // Subtitle
      tl.fromTo('.invite-subtitle',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );

      // Date badge
      tl.fromTo('.date-badge',
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' },
        '-=0.6'
      );

      // Main cake animation
      tl.fromTo('.hero-cake-lottie',
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)' },
        '-=0.8'
      );

      // Scroll indicator
      tl.fromTo('.scroll-indicator',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );

      // Floating animation for confetti
      gsap.to('.confetti-decoration', {
        y: '+=20',
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.4, from: 'random' }
      });

      // Parallax
      gsap.to('.hero-gradient', {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: 250,
        scale: 1.15,
      });

      // Detail cards
      gsap.fromTo('.detail-card',
        { y: 100, opacity: 0, rotateY: -20 },
        {
          scrollTrigger: {
            trigger: detailsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );

      // Detail card lotties
      gsap.fromTo('.card-lottie',
        { scale: 0 },
        {
          scrollTrigger: {
            trigger: detailsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(2)',
        }
      );

      // Section titles
      gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.fromTo(title as Element,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: title as Element,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          }
        );
      });

      // RSVP button
      gsap.fromTo('.rsvp-button-section',
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.rsvp-button-section',
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char" style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div
      className="birthday-invite"
      ref={containerRef}
      style={{
        background: selectedTheme.bg,
        '--theme-primary': selectedTheme.primary,
        '--theme-secondary': selectedTheme.secondary
      } as React.CSSProperties}
    >
      {/* Customization Toggle Button */}
      <button
        className="customizer-toggle"
        onClick={() => setShowCustomizer(!showCustomizer)}
      >
        {showCustomizer ? '✕' : '✎'}
      </button>

      {/* Customization Sidebar */}
      <aside className={`customizer-sidebar ${showCustomizer ? 'open' : ''}`}>
        <div className="customizer-header">
          <h3>Customize Invite</h3>
        </div>

        <div className="customizer-content">
          <div className="customizer-section">
            <label>Celebrant's Name</label>
            <input
              type="text"
              value={celebrantName}
              onChange={(e) => setCelebrantName(e.target.value)}
              placeholder="Enter name"
            />
          </div>

          <div className="customizer-section">
            <label>Event Tagline</label>
            <input
              type="text"
              value={eventSubtitle}
              onChange={(e) => setEventSubtitle(e.target.value)}
              placeholder="Enter tagline"
            />
          </div>

          <div className="customizer-section">
            <label>Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>

          <div className="customizer-section">
            <label>Event Time</label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />
          </div>

          <div className="customizer-section">
            <label>Venue Name</label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="Enter venue name"
            />
          </div>

          <div className="customizer-section">
            <label>Venue Address</label>
            <input
              type="text"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="customizer-section">
            <label>Background Theme</label>
            <div className="theme-options">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  className={`theme-btn ${selectedTheme.id === theme.id ? 'active' : ''}`}
                  style={{ background: theme.primary }}
                  onClick={() => setSelectedTheme(theme)}
                  title={theme.name}
                />
              ))}
            </div>
          </div>

          <div className="customizer-section">
            <label>Number of Guests</label>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
              min="1"
              max="500"
            />
            {guestCount > FREE_TIER_LIMIT && (
              <p className="tier-warning">
                Free tier: {FREE_TIER_LIMIT} guests max.
                <span className="upgrade-link">Upgrade for more</span>
              </p>
            )}
            {guestCount <= FREE_TIER_LIMIT && (
              <p className="tier-info">
                {FREE_TIER_LIMIT - guestCount} invites remaining (Free tier)
              </p>
            )}
          </div>

          <button className="generate-link-btn" onClick={generateLink}>
            Generate Invitation Link
          </button>
        </div>
      </aside>

      {/* Link Generated Modal */}
      {showLinkModal && (
        <div className="link-modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="link-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLinkModal(false)}>✕</button>
            <h3>Your Invitation Link</h3>
            <p className="modal-subtitle">Share this link with your {guestCount} guests</p>
            <div className="link-display">
              <input type="text" value={generatedLink} readOnly />
              <button onClick={copyLink}>Copy</button>
            </div>
            <div className="modal-info">
              <p>Free tier: {guestCount}/{FREE_TIER_LIMIT} guests used</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="invite-hero" ref={heroRef}>
        <div className="hero-gradient"></div>

        {/* Confetti Decorations - Left and Right */}
        <div className="confetti-decorations">
          <div className="confetti-decoration confetti-left">
            <DotLottieReact autoplay loop src={LOTTIE_ANIMATIONS.confetti} style={{ width: 600, height: 400 }} />
          </div>
          <div className="confetti-decoration confetti-right">
            <DotLottieReact autoplay loop src={LOTTIE_ANIMATIONS.confetti} style={{ width: 600, height: 400 }} />
          </div>
        </div>

        <div className="hero-content">
          <p className="invite-pretext">You're Cordially Invited to</p>

          <h1 className="invite-title" ref={titleRef}>
            {splitText(`${celebrantName}'s Birthday`)}
          </h1>

          <p className="invite-subtitle">{eventSubtitle}</p>

          {/* Main Cake Animation - Centered */}
          <div className="hero-cake-lottie">
            <DotLottieReact
              autoplay
              loop
              src="/cake.json"
              style={{ width: 300, height: 300 }}
            />
          </div>

          <div className="date-badge">
            <div className="badge-glow"></div>
            <span className="date-day">{dateDisplay.day}</span>
            <span className="date-month">{dateDisplay.month}</span>
            <span className="date-year">{dateDisplay.year}</span>
          </div>


        </div>
      </section>

      {/* Event Details Section - Only When and Where */}
      <section className="event-details" ref={detailsRef}>
        <h2 className="section-title">The Details</h2>

        <div className="details-grid details-grid-two">
          <div className="detail-card">
            <div className="card-lottie">
              <DotLottieReact autoplay loop src="/when.json" style={{ width: 150, height: 80 }} />
            </div>
            <div className="card-content">
              <h3>When</h3>
              <p className="detail-main">{dateDisplay.month} {dateDisplay.day}, {dateDisplay.year}</p>
              <p className="detail-sub">{formatTime(eventTime)}</p>
            </div>
          </div>

          <div className="detail-card">
            <div className="card-lottie">
              <DotLottieReact autoplay loop src="/where.json" style={{ width: 150, height: 80 }} />
            </div>
            <div className="card-content">
              <h3>Where</h3>
              <p className="detail-main">{venueName}</p>
              <p className="detail-sub">{venueAddress}</p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP Button Section */}
      <section className="rsvp-button-section">
        <button className="rsvp-btn">
          <span>RSVP Now</span>
        </button>
      </section>

      {/* Made by Inviteflow */}
      <footer className="inviteflow-footer">
        <div className="inviteflow-brand">
          <div className="inviteflow-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--theme-primary, #d4af37)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="var(--theme-primary, #d4af37)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="var(--theme-primary, #d4af37)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="inviteflow-text">Made by <strong>Inviteflow</strong></span>
        </div>
      </footer>
    </div>
  );
};

export default BirthdayInvite;
