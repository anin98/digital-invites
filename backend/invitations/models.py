import uuid
import secrets
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class Template(models.Model):
    """Invitation template model."""

    class Category(models.TextChoices):
        BIRTHDAY = 'birthday', 'Birthday'
        WEDDING = 'wedding', 'Wedding'
        CORPORATE = 'corporate', 'Corporate'
        KIDS = 'kids', 'Kids'
        HANGOUT = 'hangout', 'Hangout'

    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices)
    emoji = models.CharField(max_length=10, blank=True)
    hue_a = models.IntegerField(default=0)
    hue_b = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'templates'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"


class Theme(models.Model):
    """Color theme for invitations."""

    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=50)
    primary_color = models.CharField(max_length=20)
    secondary_color = models.CharField(max_length=20)
    bg_gradient = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'themes'
        ordering = ['name']

    def __str__(self):
        return self.name


class Invitation(models.Model):
    """Main invitation model."""

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        ACTIVE = 'active', 'Active'
        EXPIRED = 'expired', 'Expired'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='invitations'
    )
    template = models.ForeignKey(
        Template,
        on_delete=models.SET_NULL,
        null=True,
        related_name='invitations'
    )
    theme = models.ForeignKey(
        Theme,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invitations'
    )

    # Event details
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    celebrant_name = models.CharField(max_length=100, blank=True)
    event_date = models.DateField()
    event_time = models.TimeField(null=True, blank=True)
    venue_name = models.CharField(max_length=200, blank=True)
    venue_address = models.TextField(blank=True)

    # Settings
    max_guests = models.PositiveIntegerField(default=50)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'invitations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.event_date}"

    def save(self, *args, **kwargs):
        # Auto-expire invitations after the event date
        if not self.expires_at and self.event_date:
            self.expires_at = timezone.make_aware(
                timezone.datetime.combine(self.event_date, timezone.datetime.max.time())
            )
        super().save(*args, **kwargs)

    @property
    def guest_count(self):
        return self.guests.count()

    @property
    def attending_count(self):
        return self.guests.filter(rsvp_status=Guest.RSVPStatus.ATTENDING).count()

    @property
    def pending_count(self):
        return self.guests.filter(rsvp_status=Guest.RSVPStatus.PENDING).count()

    @property
    def not_attending_count(self):
        return self.guests.filter(rsvp_status=Guest.RSVPStatus.NOT_ATTENDING).count()

    @property
    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False

    def can_add_guest(self):
        if self.user.max_guests_per_invitation is None:
            return True
        return self.guest_count < self.max_guests


class Guest(models.Model):
    """Guest model for invitation tracking."""

    class RSVPStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ATTENDING = 'attending', 'Attending'
        NOT_ATTENDING = 'not_attending', 'Not Attending'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invitation = models.ForeignKey(
        Invitation,
        on_delete=models.CASCADE,
        related_name='guests'
    )
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    rsvp_status = models.CharField(
        max_length=15,
        choices=RSVPStatus.choices,
        default=RSVPStatus.PENDING
    )
    rsvp_date = models.DateTimeField(null=True, blank=True)
    plus_one = models.BooleanField(default=False)
    plus_one_count = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    invitation_sent = models.BooleanField(default=False)
    invitation_sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'guests'
        ordering = ['-created_at']
        unique_together = ['invitation', 'email']

    def __str__(self):
        return f"{self.name} ({self.email})"

    def update_rsvp(self, status):
        self.rsvp_status = status
        self.rsvp_date = timezone.now()
        self.save()


class ShareLink(models.Model):
    """Shareable link for invitations."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invitation = models.ForeignKey(
        Invitation,
        on_delete=models.CASCADE,
        related_name='share_links'
    )
    token = models.CharField(max_length=64, unique=True, db_index=True)
    is_active = models.BooleanField(default=True)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    class Meta:
        db_table = 'share_links'
        ordering = ['-created_at']

    def __str__(self):
        return f"Link for {self.invitation.title}"

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(32)
        if not self.expires_at:
            expiry_days = settings.INVITEFLOW_SETTINGS.get('SHARE_LINK_EXPIRY_DAYS', 30)
            self.expires_at = timezone.now() + timedelta(days=expiry_days)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return self.is_active and not self.is_expired

    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])
