import * as motion from 'motion/react-client';
import type { Variants } from 'motion/react';
import { Link } from 'react-router-dom';
import { templates, type Template } from '../data/templates';
import './TemplateList.css';

export default function TemplateList() {
  return (
    <section className="template-list-section">
      <div className="section-header">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Choose Your Template
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section-subtitle"
        >
          Beautiful designs for every occasion
        </motion.p>
      </div>

      <div className="template-cards-container">
        {templates.map((template, i) => (
          <TemplateCard key={template.id} template={template} index={i} />
        ))}
      </div>
    </section>
  );
}

interface TemplateCardProps {
  template: Template;
  index: number;
}

function TemplateCard({ template, index }: TemplateCardProps) {
  const hue = (h: number) => `hsl(${h}, 100%, 50%)`;
  const background = `linear-gradient(306deg, ${hue(template.hueA)}, ${hue(template.hueB)})`;

  return (
    <motion.div
      className={`template-card-container template-card-${index}`}
      style={cardContainerStyle}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.8 }}
    >
      <div className="template-splash" style={{ ...splashStyle, background }} />
      <motion.div
        className="template-card"
        style={cardStyle}
        variants={cardVariants}
      >
        {template.video ? (
          <video
            className="template-video"
            src={template.video}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div className="template-emoji">{template.emoji}</div>
        )}
        <div className="template-info">
          <span className="template-category">{template.category}</span>
          <h3 className="template-name">{template.name}</h3>
          <p className="template-description">{template.description}</p>
          <Link to={`/template/${template.id}`} className="template-btn">
            Use Template
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

const cardVariants: Variants = {
  offscreen: {
    y: 300,
  },
  onscreen: {
    y: 50,
    rotate: -10,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const cardContainerStyle: React.CSSProperties = {
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  paddingTop: 20,
  marginBottom: -120,
};

const splashStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
};

const cardStyle: React.CSSProperties = {
  width: 300,
  height: 430,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderRadius: 20,
  background: '#1a1a1a',
  boxShadow:
    '0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)',
  transformOrigin: '10% 60%',
  padding: '2rem 1.5rem',
  textAlign: 'center',
};
