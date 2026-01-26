from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone

from .models import Template, Theme, Invitation, Guest, ShareLink
from .serializers import (
    TemplateSerializer,
    ThemeSerializer,
    InvitationListSerializer,
    InvitationDetailSerializer,
    InvitationCreateSerializer,
    InvitationUpdateSerializer,
    GuestSerializer,
    GuestCreateSerializer,
    RSVPSerializer,
    ShareLinkSerializer,
    PublicInvitationSerializer,
    DashboardStatsSerializer
)


class TemplateListView(generics.ListAPIView):
    """List all active templates."""

    queryset = Template.objects.filter(is_active=True)
    serializer_class = TemplateSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class TemplateDetailView(generics.RetrieveAPIView):
    """Get template details."""

    queryset = Template.objects.filter(is_active=True)
    serializer_class = TemplateSerializer
    permission_classes = [AllowAny]


class ThemeListView(generics.ListAPIView):
    """List all active themes."""

    queryset = Theme.objects.filter(is_active=True)
    serializer_class = ThemeSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class InvitationViewSet(viewsets.ModelViewSet):
    """ViewSet for invitation CRUD operations."""

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Invitation.objects.filter(user=self.request.user).select_related(
            'template', 'theme'
        ).prefetch_related('guests')

    def get_serializer_class(self):
        if self.action == 'list':
            return InvitationListSerializer
        elif self.action in ['create']:
            return InvitationCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return InvitationUpdateSerializer
        return InvitationDetailSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def clone(self, request, pk=None):
        """Clone an existing invitation."""
        invitation = self.get_object()

        new_invitation = Invitation.objects.create(
            user=request.user,
            template=invitation.template,
            theme=invitation.theme,
            title=f"{invitation.title} (Copy)",
            subtitle=invitation.subtitle,
            celebrant_name=invitation.celebrant_name,
            event_date=invitation.event_date,
            event_time=invitation.event_time,
            venue_name=invitation.venue_name,
            venue_address=invitation.venue_address,
            max_guests=invitation.max_guests,
            status=Invitation.Status.DRAFT
        )

        return Response(
            InvitationDetailSerializer(new_invitation).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get', 'post'])
    def share_link(self, request, pk=None):
        """Get or create a share link for the invitation."""
        invitation = self.get_object()

        if request.method == 'GET':
            share_link = invitation.share_links.filter(is_active=True).first()
            if share_link:
                return Response(ShareLinkSerializer(share_link).data)
            return Response({'detail': 'No active share link.'}, status=status.HTTP_404_NOT_FOUND)

        # POST - create new share link
        share_link = ShareLink.objects.create(invitation=invitation)
        return Response(
            ShareLinkSerializer(share_link).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        """Get analytics for an invitation."""
        invitation = self.get_object()

        return Response({
            'guest_count': invitation.guest_count,
            'attending_count': invitation.attending_count,
            'pending_count': invitation.pending_count,
            'not_attending_count': invitation.not_attending_count,
            'share_link_views': sum(
                link.view_count for link in invitation.share_links.all()
            ),
            'invitation_sent_count': invitation.guests.filter(invitation_sent=True).count(),
        })


class GuestViewSet(viewsets.ModelViewSet):
    """ViewSet for guest management."""

    serializer_class = GuestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        invitation_id = self.kwargs.get('invitation_pk')
        return Guest.objects.filter(
            invitation_id=invitation_id,
            invitation__user=self.request.user
        )

    def get_serializer_class(self):
        if self.action == 'create':
            return GuestCreateSerializer
        return GuestSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        invitation_id = self.kwargs.get('invitation_pk')
        context['invitation'] = get_object_or_404(
            Invitation, id=invitation_id, user=self.request.user
        )
        return context

    def perform_create(self, serializer):
        invitation_id = self.kwargs.get('invitation_pk')
        invitation = get_object_or_404(
            Invitation, id=invitation_id, user=self.request.user
        )

        if not invitation.can_add_guest():
            from rest_framework.exceptions import ValidationError
            raise ValidationError("Maximum guest limit reached for this invitation.")

        serializer.save(invitation=invitation)

    @action(detail=True, methods=['post'])
    def send_invitation(self, request, invitation_pk=None, pk=None):
        """Send invitation email to a guest."""
        guest = self.get_object()

        # Get or create share link
        invitation = guest.invitation
        share_link = invitation.share_links.filter(is_active=True).first()
        if not share_link:
            share_link = ShareLink.objects.create(invitation=invitation)

        # Send email
        try:
            send_mail(
                subject=f"You're Invited: {invitation.title}",
                message=f"""
Hi {guest.name},

You've been invited to {invitation.title}!

Event Date: {invitation.event_date}
Venue: {invitation.venue_name}

Please RSVP using this link:
{request.build_absolute_uri(f'/invite/{share_link.token}')}

We hope to see you there!
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[guest.email],
                fail_silently=False,
            )

            guest.invitation_sent = True
            guest.invitation_sent_at = timezone.now()
            guest.save()

            return Response({'message': 'Invitation sent successfully.'})
        except Exception as e:
            return Response(
                {'error': f'Failed to send email: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def bulk_create(self, request, invitation_pk=None):
        """Add multiple guests at once."""
        invitation = get_object_or_404(
            Invitation, id=invitation_pk, user=request.user
        )

        guests_data = request.data.get('guests', [])
        created_guests = []
        errors = []

        for guest_data in guests_data:
            serializer = GuestCreateSerializer(
                data=guest_data,
                context={'invitation': invitation, 'request': request}
            )
            if serializer.is_valid():
                if invitation.can_add_guest():
                    guest = serializer.save(invitation=invitation)
                    created_guests.append(GuestSerializer(guest).data)
                else:
                    errors.append({
                        'email': guest_data.get('email'),
                        'error': 'Maximum guest limit reached.'
                    })
            else:
                errors.append({
                    'email': guest_data.get('email'),
                    'error': serializer.errors
                })

        return Response({
            'created': created_guests,
            'errors': errors
        }, status=status.HTTP_201_CREATED if created_guests else status.HTTP_400_BAD_REQUEST)


class PublicInvitationView(APIView):
    """Public endpoint to view invitation via share link."""

    permission_classes = [AllowAny]

    def get(self, request, token):
        share_link = get_object_or_404(ShareLink, token=token)

        if not share_link.is_valid:
            return Response(
                {'error': 'This invitation link has expired or is no longer valid.'},
                status=status.HTTP_410_GONE
            )

        share_link.increment_view_count()

        return Response(PublicInvitationSerializer(share_link.invitation).data)


class RSVPView(APIView):
    """Public endpoint for RSVP submission."""

    permission_classes = [AllowAny]

    def post(self, request, token):
        share_link = get_object_or_404(ShareLink, token=token)

        if not share_link.is_valid:
            return Response(
                {'error': 'This invitation link has expired or is no longer valid.'},
                status=status.HTTP_410_GONE
            )

        serializer = RSVPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation = share_link.invitation
        data = serializer.validated_data

        # Check if guest already exists
        guest, created = Guest.objects.get_or_create(
            invitation=invitation,
            email=data['email'],
            defaults={
                'name': data['name'],
                'rsvp_status': data['rsvp_status'],
                'plus_one': data['plus_one'],
                'plus_one_count': data['plus_one_count'],
                'notes': data.get('notes', ''),
                'rsvp_date': timezone.now()
            }
        )

        if not created:
            # Update existing guest RSVP
            guest.name = data['name']
            guest.rsvp_status = data['rsvp_status']
            guest.plus_one = data['plus_one']
            guest.plus_one_count = data['plus_one_count']
            guest.notes = data.get('notes', '')
            guest.rsvp_date = timezone.now()
            guest.save()

        return Response({
            'message': 'RSVP submitted successfully.',
            'guest': GuestSerializer(guest).data
        })


class DashboardStatsView(APIView):
    """Get dashboard statistics for the authenticated user."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        invitations = Invitation.objects.filter(user=request.user)

        # Get counts by template
        template_counts = invitations.values('template__category').annotate(
            count=Count('id')
        )
        invitations_by_template = {
            item['template__category']: item['count']
            for item in template_counts if item['template__category']
        }

        # Calculate totals
        guests = Guest.objects.filter(invitation__user=request.user)

        stats = {
            'total_invitations': invitations.count(),
            'active_invitations': invitations.filter(status=Invitation.Status.ACTIVE).count(),
            'total_guests': guests.count(),
            'total_attending': guests.filter(rsvp_status=Guest.RSVPStatus.ATTENDING).count(),
            'total_pending': guests.filter(rsvp_status=Guest.RSVPStatus.PENDING).count(),
            'total_not_attending': guests.filter(rsvp_status=Guest.RSVPStatus.NOT_ATTENDING).count(),
            'invitations_by_template': invitations_by_template,
        }

        return Response(DashboardStatsSerializer(stats).data)


class CategoryListView(APIView):
    """Get list of template categories."""

    permission_classes = [AllowAny]

    def get(self, request):
        categories = [
            {'id': choice[0], 'name': choice[1]}
            for choice in Template.Category.choices
        ]
        return Response(categories)
