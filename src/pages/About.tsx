import * as motion from 'motion/react-client';
import './About.css';

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="about-title"
        >
          About InviteFlow
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="about-subtitle"
        >
          Making celebrations more memorable, one invitation at a time
        </motion.p>
      </section>

      <section className="about-content">
        <motion.div
          className="about-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Our Mission</h2>
          <p>
            At InviteFlow, we believe every celebration deserves a beautiful beginning.
            Our mission is to make creating stunning digital invitations accessible to
            everyone, regardless of design experience.
          </p>
        </motion.div>

        <motion.div
          className="about-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2>What We Offer</h2>
          <p>
            From birthday parties to weddings, corporate events to kids' celebrations,
            we provide professionally designed templates that you can customize in
            minutes. Share them instantly via email, text, or social media.
          </p>
        </motion.div>

        <motion.div
          className="about-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2>Why Digital?</h2>
          <p>
            Digital invitations are eco-friendly, cost-effective, and incredibly
            convenient. Track RSVPs in real-time, send reminders, and make updates
            instantly - all from your device.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
