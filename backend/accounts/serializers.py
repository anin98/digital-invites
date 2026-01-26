from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""

    invitation_count = serializers.ReadOnlyField()
    can_create_invitation = serializers.ReadOnlyField()
    max_guests_per_invitation = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'tier', 'invitation_count', 'can_create_invitation',
            'max_guests_per_invitation', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'tier', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': "Passwords don't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email'].split('@')[0]),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""

    old_password = serializers.CharField(required=True, style={'input_type': 'password'})
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class UserTierSerializer(serializers.ModelSerializer):
    """Serializer for user tier information."""

    invitation_count = serializers.ReadOnlyField()
    can_create_invitation = serializers.ReadOnlyField()
    max_guests_per_invitation = serializers.ReadOnlyField()
    invitations_remaining = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'tier', 'invitation_count', 'can_create_invitation',
            'max_guests_per_invitation', 'invitations_remaining'
        ]

    def get_invitations_remaining(self, obj):
        from django.conf import settings
        limits = settings.INVITEFLOW_SETTINGS

        if obj.tier == User.Tier.FREE:
            max_inv = limits['FREE_TIER_MAX_INVITATIONS']
        elif obj.tier == User.Tier.PRO:
            max_inv = limits['PRO_TIER_MAX_INVITATIONS']
        else:
            return None  # Unlimited

        return max(0, max_inv - obj.invitation_count)
