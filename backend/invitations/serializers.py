from rest_framework import serializers
from .models import Template, Theme, Invitation, Guest, ShareLink


class TemplateSerializer(serializers.ModelSerializer):
    """Serializer for invitation templates."""

    class Meta:
        model = Template
        fields = [
            'id', 'name', 'category', 'emoji', 'hue_a', 'hue_b',
            'description', 'image_url', 'video_url', 'created_at'
        ]


class ThemeSerializer(serializers.ModelSerializer):
    """Serializer for color themes."""

    class Meta:
        model = Theme
        fields = ['id', 'name', 'primary_color', 'secondary_color', 'bg_gradient']


class GuestSerializer(serializers.ModelSerializer):
    """Serializer for guests."""

    class Meta:
        model = Guest
        fields = [
            'id', 'name', 'email', 'phone', 'rsvp_status', 'rsvp_date',
            'plus_one', 'plus_one_count', 'notes', 'invitation_sent',
            'invitation_sent_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'rsvp_date', 'invitation_sent_at', 'created_at', 'updated_at']


class GuestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating guests."""

    class Meta:
        model = Guest
        fields = ['name', 'email', 'phone', 'plus_one', 'plus_one_count', 'notes']

    def validate_email(self, value):
        invitation = self.context.get('invitation')
        if invitation and Guest.objects.filter(invitation=invitation, email=value).exists():
            raise serializers.ValidationError("A guest with this email already exists for this invitation.")
        return value


class RSVPSerializer(serializers.Serializer):
    """Serializer for RSVP submission."""

    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    rsvp_status = serializers.ChoiceField(choices=Guest.RSVPStatus.choices)
    plus_one = serializers.BooleanField(default=False)
    plus_one_count = serializers.IntegerField(min_value=0, max_value=5, default=0)
    notes = serializers.CharField(max_length=500, required=False, allow_blank=True)


class ShareLinkSerializer(serializers.ModelSerializer):
    """Serializer for share links."""

    is_valid = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()

    class Meta:
        model = ShareLink
        fields = [
            'id', 'token', 'is_active', 'view_count',
            'is_valid', 'is_expired', 'created_at', 'expires_at'
        ]
        read_only_fields = ['id', 'token', 'view_count', 'created_at']


class InvitationListSerializer(serializers.ModelSerializer):
    """Serializer for invitation list view."""

    template_name = serializers.CharField(source='template.name', read_only=True)
    template_category = serializers.CharField(source='template.category', read_only=True)
    guest_count = serializers.ReadOnlyField()
    attending_count = serializers.ReadOnlyField()
    pending_count = serializers.ReadOnlyField()
    not_attending_count = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()

    class Meta:
        model = Invitation
        fields = [
            'id', 'title', 'template', 'template_name', 'template_category',
            'event_date', 'event_time', 'status', 'guest_count',
            'attending_count', 'pending_count', 'not_attending_count',
            'is_expired', 'created_at'
        ]


class InvitationDetailSerializer(serializers.ModelSerializer):
    """Serializer for invitation detail view."""

    template = TemplateSerializer(read_only=True)
    theme = ThemeSerializer(read_only=True)
    guests = GuestSerializer(many=True, read_only=True)
    guest_count = serializers.ReadOnlyField()
    attending_count = serializers.ReadOnlyField()
    pending_count = serializers.ReadOnlyField()
    not_attending_count = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()

    class Meta:
        model = Invitation
        fields = [
            'id', 'title', 'subtitle', 'celebrant_name', 'template', 'theme',
            'event_date', 'event_time', 'venue_name', 'venue_address',
            'max_guests', 'status', 'guests', 'guest_count',
            'attending_count', 'pending_count', 'not_attending_count',
            'is_expired', 'created_at', 'updated_at', 'expires_at'
        ]


class InvitationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating invitations."""

    template_id = serializers.CharField(write_only=True)
    theme_id = serializers.CharField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Invitation
        fields = [
            'title', 'subtitle', 'celebrant_name', 'template_id', 'theme_id',
            'event_date', 'event_time', 'venue_name', 'venue_address',
            'max_guests', 'status'
        ]

    def validate_template_id(self, value):
        try:
            Template.objects.get(id=value, is_active=True)
        except Template.DoesNotExist:
            raise serializers.ValidationError("Invalid template ID.")
        return value

    def validate_theme_id(self, value):
        if value:
            try:
                Theme.objects.get(id=value, is_active=True)
            except Theme.DoesNotExist:
                raise serializers.ValidationError("Invalid theme ID.")
        return value

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.can_create_invitation:
            raise serializers.ValidationError(
                "You have reached the maximum number of invitations for your tier. "
                "Please upgrade to create more invitations."
            )
        return attrs

    def create(self, validated_data):
        template_id = validated_data.pop('template_id')
        theme_id = validated_data.pop('theme_id', None)

        invitation = Invitation.objects.create(
            user=self.context['request'].user,
            template_id=template_id,
            theme_id=theme_id,
            **validated_data
        )
        return invitation


class InvitationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating invitations."""

    theme_id = serializers.CharField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Invitation
        fields = [
            'title', 'subtitle', 'celebrant_name', 'theme_id',
            'event_date', 'event_time', 'venue_name', 'venue_address',
            'max_guests', 'status'
        ]

    def validate_theme_id(self, value):
        if value:
            try:
                Theme.objects.get(id=value, is_active=True)
            except Theme.DoesNotExist:
                raise serializers.ValidationError("Invalid theme ID.")
        return value

    def update(self, instance, validated_data):
        theme_id = validated_data.pop('theme_id', None)
        if theme_id is not None:
            instance.theme_id = theme_id

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class PublicInvitationSerializer(serializers.ModelSerializer):
    """Serializer for public invitation view (via share link)."""

    template = TemplateSerializer(read_only=True)
    theme = ThemeSerializer(read_only=True)

    class Meta:
        model = Invitation
        fields = [
            'id', 'title', 'subtitle', 'celebrant_name', 'template', 'theme',
            'event_date', 'event_time', 'venue_name', 'venue_address'
        ]


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics."""

    total_invitations = serializers.IntegerField()
    active_invitations = serializers.IntegerField()
    total_guests = serializers.IntegerField()
    total_attending = serializers.IntegerField()
    total_pending = serializers.IntegerField()
    total_not_attending = serializers.IntegerField()
    invitations_by_template = serializers.DictField()
