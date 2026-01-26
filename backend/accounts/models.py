import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model with tier-based subscription."""

    class Tier(models.TextChoices):
        FREE = 'free', 'Free'
        PRO = 'pro', 'Pro'
        PREMIUM = 'premium', 'Premium'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    tier = models.CharField(max_length=10, choices=Tier.choices, default=Tier.FREE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    @property
    def invitation_count(self):
        return self.invitations.count()

    @property
    def can_create_invitation(self):
        from django.conf import settings
        limits = settings.INVITEFLOW_SETTINGS

        if self.tier == self.Tier.FREE:
            max_invitations = limits['FREE_TIER_MAX_INVITATIONS']
        elif self.tier == self.Tier.PRO:
            max_invitations = limits['PRO_TIER_MAX_INVITATIONS']
        else:
            return True  # Premium has unlimited

        return self.invitation_count < max_invitations

    @property
    def max_guests_per_invitation(self):
        from django.conf import settings
        limits = settings.INVITEFLOW_SETTINGS

        if self.tier == self.Tier.FREE:
            return limits['FREE_TIER_MAX_GUESTS_PER_INVITATION']
        elif self.tier == self.Tier.PRO:
            return limits['PRO_TIER_MAX_GUESTS_PER_INVITATION']
        else:
            return None  # Unlimited
