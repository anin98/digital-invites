from django.core.management.base import BaseCommand
from invitations.models import Template, Theme


class Command(BaseCommand):
    help = 'Seed the database with initial templates and themes'

    def handle(self, *args, **options):
        self.stdout.write('Seeding templates...')
        self.seed_templates()

        self.stdout.write('Seeding themes...')
        self.seed_themes()

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))

    def seed_templates(self):
        templates = [
            {
                'id': 'birthday-elegant',
                'name': 'Elegant Gold',
                'category': 'birthday',
                'emoji': '🎂',
                'hue_a': 45,
                'hue_b': 30,
                'description': 'A sophisticated birthday invitation with elegant gold accents and refined typography.',
                'video_url': '/bday cake.mp4',
            },
            {
                'id': 'wedding-romantic',
                'name': 'Romantic',
                'category': 'wedding',
                'emoji': '💒',
                'hue_a': 340,
                'hue_b': 10,
                'description': 'A romantic wedding invitation with soft colors and elegant floral designs.',
                'video_url': '/wedding.mp4',
            },
            {
                'id': 'corporate-modern',
                'name': 'Modern Professional',
                'category': 'corporate',
                'emoji': '🏢',
                'hue_a': 210,
                'hue_b': 230,
                'description': 'A sleek, professional invitation perfect for corporate events and business gatherings.',
                'video_url': '/corporate.mp4',
            },
            {
                'id': 'hangout',
                'name': 'Fun Hangout',
                'category': 'hangout',
                'emoji': '🎉',
                'hue_a': 280,
                'hue_b': 320,
                'description': 'A fun and colorful invitation for casual get-togethers and hangouts.',
                'video_url': '/hangout.mp4',
            },
        ]

        for template_data in templates:
            Template.objects.update_or_create(
                id=template_data['id'],
                defaults=template_data
            )
            self.stdout.write(f"  Created/Updated template: {template_data['name']}")

    def seed_themes(self):
        themes = [
            {
                'id': 'gold',
                'name': 'Elegant Gold',
                'primary_color': '#FFD700',
                'secondary_color': '#DAA520',
                'bg_gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            },
            {
                'id': 'rose',
                'name': 'Rose Pink',
                'primary_color': '#FF6B9D',
                'secondary_color': '#C44569',
                'bg_gradient': 'linear-gradient(135deg, #2d132c 0%, #801336 50%, #c72c41 100%)',
            },
            {
                'id': 'ocean',
                'name': 'Ocean Blue',
                'primary_color': '#00D9FF',
                'secondary_color': '#0099CC',
                'bg_gradient': 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 50%, #0d47a1 100%)',
            },
            {
                'id': 'emerald',
                'name': 'Emerald Green',
                'primary_color': '#00E676',
                'secondary_color': '#00C853',
                'bg_gradient': 'linear-gradient(135deg, #0d1b0d 0%, #1b3d1b 50%, #2e7d32 100%)',
            },
            {
                'id': 'purple',
                'name': 'Royal Purple',
                'primary_color': '#BB86FC',
                'secondary_color': '#9C27B0',
                'bg_gradient': 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #4a148c 100%)',
            },
        ]

        for theme_data in themes:
            Theme.objects.update_or_create(
                id=theme_data['id'],
                defaults=theme_data
            )
            self.stdout.write(f"  Created/Updated theme: {theme_data['name']}")
