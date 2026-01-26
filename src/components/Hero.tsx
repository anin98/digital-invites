import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
// @ts-expect-error - three types not needed for vanta
import * as THREE from 'three';
// @ts-expect-error - vanta doesn't have type definitions
import BIRDS from 'vanta/dist/vanta.birds.min';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    // Initialize Vanta.js Waves effect (doesn't require THREE.js)
    if (heroRef.current && !vantaRef.current) {
      vantaRef.current = BIRDS({
        el: heroRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x111111,
        color1: 0xff6b9d,
        color2: 0x9d4edd,
        colorMode: 'lerp',
        birdSize: 1.2,
        wingSpan: 25.0,
        speedLimit: 4.0,
        separation: 60.0,
        alignment: 40.0,
        cohesion: 40.0,
        quantity: 3.0,
      });
    }

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Create Stunning
          <span className="gradient-text"> Digital Invitations</span>
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          Design beautiful invitations for any occasion. From birthdays to weddings,
          corporate events to parties - make every celebration memorable.
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
