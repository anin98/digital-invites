import Hero from '../components/Hero';
import TemplateList from '../components/TemplateList';
import Features from '../components/Features';
import './Home.css';

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <TemplateList />
      <Features />
    </main>
  );
}
