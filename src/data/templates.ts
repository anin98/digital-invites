export interface Template {
  id: string;
  name: string;
  category: 'birthday' | 'wedding' | 'corporate' | 'kids';
  emoji: string;
  hueA: number;
  hueB: number;
  description: string;
  image?: string;
  video?: string;
}

export const templates: Template[] = [
  {
    id: 'birthday-elegant',
    name: 'Elegant Birthday',
    category: 'birthday',
    emoji: '🎂',
    video: '/bday cake.mp4',
    hueA: 340,
    hueB: 10,
    description: 'A sophisticated birthday invitation with elegant design',
  },
  {
    id: 'wedding-romantic',
    name: 'Romantic Wedding',
    category: 'wedding',
    emoji: '💒',
    hueA: 320,
    hueB: 350,
    description: 'A romantic and timeless wedding invitation',
  },
  {
    id: 'corporate-modern',
    name: 'Modern Corporate',
    category: 'corporate',
    emoji: '🏢',
    hueA: 200,
    hueB: 240,
    description: 'Professional corporate event invitation',
  },
  {
    id: 'kids-party',
    name: 'Fun Kids Party',
    category: 'kids',
    emoji: '🎈',
    hueA: 40,
    hueB: 80,
    description: 'Colorful and fun invitation for kids parties',
  },
];

export const categories = [
  { id: 'birthday', name: 'Birthday', emoji: '🎂' },
  { id: 'wedding', name: 'Wedding', emoji: '💒' },
  { id: 'corporate', name: 'Corporate', emoji: '🏢' },
  { id: 'kids', name: 'Kids Party', emoji: '🎈' },
];
