import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Title animation - split into characters
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      })
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          ctaRef.current?.children || [],
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
          },
          '-=0.4'
        );

      // Floating elements animation
      gsap.to(floatingRef.current?.querySelectorAll('.floating-element') || [], {
        y: 'random(-20, 20)',
        x: 'random(-10, 10)',
        rotation: 'random(-15, 15)',
        duration: 'random(2, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.2,
          from: 'random',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div ref={floatingRef} className="floating-elements">
        <span className="floating-element">🎉</span>
        <span className="floating-element">💐</span>
        <span className="floating-element">🎊</span>
        <span className="floating-element">💍</span>
        <span className="floating-element">🎈</span>
        <span className="floating-element">🎁</span>
      </div>

      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Create Stunning
          <span className="gradient-text"> Digital Invitations</span>
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          Design beautiful invitations for any occasion. From birthdays to weddings,
          corporate events to kids' parties - make every celebration memorable.
        </p>
        <div ref={ctaRef} className="hero-cta">
          <Link to="/templates" className="btn btn-primary">
            Browse Templates
          </Link>
          <Link to="/about" className="btn btn-secondary">
            Learn More
          </Link>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}
