from django.contrib import admin
from .models import Template, Theme, Invitation, Guest, ShareLink


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    """Admin configuration for Template model."""

    list_display = ['id', 'name', 'category', 'emoji', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['id', 'name', 'description']
    ordering = ['category', 'name']


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    """Admin configuration for Theme model."""

    list_display = ['id', 'name', 'primary_color', 'secondary_color', 'is_active']
    list_filter = ['is_active']
    search_fields = ['id', 'name']


class GuestInline(admin.TabularInline):
    """Inline admin for guests in invitation."""

    model = Guest
    extra = 0
    readonly_fields = ['rsvp_date', 'invitation_sent_at', 'created_at']
    fields = ['name', 'email', 'rsvp_status', 'plus_one', 'invitation_sent']


class ShareLinkInline(admin.TabularInline):
    """Inline admin for share links in invitation."""

    model = ShareLink
    extra = 0
    readonly_fields = ['token', 'view_count', 'created_at']
    fields = ['token', 'is_active', 'view_count', 'expires_at']


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    """Admin configuration for Invitation model."""

    list_display = [
        'title', 'user', 'template', 'event_date', 'status',
        'guest_count', 'attending_count', 'created_at'
    ]
    list_filter = ['status', 'template__category', 'created_at', 'event_date']
    search_fields = ['title', 'user__email', 'celebrant_name', 'venue_name']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        (None, {'fields': ('user', 'template', 'theme', 'status')}),
        ('Event Details', {
            'fields': ('title', 'subtitle', 'celebrant_name', 'event_date', 'event_time')
        }),
        ('Venue', {'fields': ('venue_name', 'venue_address')}),
        ('Settings', {'fields': ('max_guests', 'expires_at')}),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at', 'updated_at']
    inlines = [GuestInline, ShareLinkInline]

    def guest_count(self, obj):
        return obj.guest_count
    guest_count.short_description = 'Guests'

    def attending_count(self, obj):
        return obj.attending_count
    attending_count.short_description = 'Attending'


@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    """Admin configuration for Guest model."""

    list_display = [
        'name', 'email', 'invitation', 'rsvp_status',
        'plus_one', 'invitation_sent', 'created_at'
    ]
    list_filter = ['rsvp_status', 'invitation_sent', 'plus_one', 'created_at']
    search_fields = ['name', 'email', 'invitation__title']
    ordering = ['-created_at']

    fieldsets = (
        (None, {'fields': ('invitation', 'name', 'email', 'phone')}),
        ('RSVP', {'fields': ('rsvp_status', 'rsvp_date', 'plus_one', 'plus_one_count', 'notes')}),
        ('Invitation Status', {'fields': ('invitation_sent', 'invitation_sent_at')}),
    )

    readonly_fields = ['rsvp_date', 'invitation_sent_at', 'created_at', 'updated_at']


@admin.register(ShareLink)
class ShareLinkAdmin(admin.ModelAdmin):
    """Admin configuration for ShareLink model."""

    list_display = ['token', 'invitation', 'is_active', 'view_count', 'expires_at', 'created_at']
    list_filter = ['is_active', 'created_at', 'expires_at']
    search_fields = ['token', 'invitation__title']
    ordering = ['-created_at']

    readonly_fields = ['token', 'view_count', 'created_at']
