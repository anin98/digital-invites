import { useState } from 'react';
import * as motion from 'motion/react-client';
import { Link } from 'react-router-dom';
import { templates, categories } from '../data/templates';
import './Templates.css';

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTemplates =
    activeCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const hue = (h: number) => `hsl(${h}, 100%, 50%)`;

  return (
    <main className="templates-page">
      <section className="templates-hero">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="templates-title"
        >
          Explore Templates
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="templates-subtitle"
        >
          Find the perfect design for your special occasion
        </motion.p>
      </section>

      <section className="templates-content">
        <div className="category-filters">
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <motion.div
          className="templates-grid"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              className="template-grid-card"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="template-grid-preview"
                style={{
                  background: `linear-gradient(135deg, ${hue(template.hueA)}, ${hue(template.hueB)})`,
                }}
              >
                <span className="template-grid-emoji">{template.emoji}</span>
              </div>
              <div className="template-grid-info">
                <span className="template-grid-category">{template.category}</span>
                <h3 className="template-grid-name">{template.name}</h3>
                <p className="template-grid-desc">{template.description}</p>
                <Link to={`/template/${template.id}`} className="template-grid-btn">
                  Use Template
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
