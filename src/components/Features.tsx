import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Features.css';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: '🎨',
    title: 'Beautiful Templates',
    description: 'Choose from dozens of professionally designed templates for any occasion.',
  },
  {
    icon: '✏️',
    title: 'Easy Customization',
    description: 'Personalize every detail with our intuitive drag-and-drop editor.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Your invitations look perfect on any device, from phones to desktops.',
  },
  {
    icon: '📧',
    title: 'Instant Sharing',
    description: 'Share via email, SMS, or social media with just one click.',
  },
  {
    icon: '📊',
    title: 'RSVP Tracking',
    description: 'Keep track of who\'s coming with real-time response management.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security.',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Why Choose InviteFlow?</h2>
          <p className="features-subtitle">
            Everything you need to create memorable digital invitations
          </p>
        </div>

        <div ref={cardsRef} className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
