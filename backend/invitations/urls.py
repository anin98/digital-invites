from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from .views import (
    TemplateListView,
    TemplateDetailView,
    ThemeListView,
    CategoryListView,
    InvitationViewSet,
    GuestViewSet,
    PublicInvitationView,
    RSVPView,
    DashboardStatsView
)

app_name = 'invitations'

# Main router for invitations
router = DefaultRouter()
router.register(r'invitations', InvitationViewSet, basename='invitation')

# Nested router for guests under invitations
invitations_router = routers.NestedDefaultRouter(router, r'invitations', lookup='invitation')
invitations_router.register(r'guests', GuestViewSet, basename='invitation-guests')

urlpatterns = [
    # Templates
    path('templates/', TemplateListView.as_view(), name='template_list'),
    path('templates/<str:pk>/', TemplateDetailView.as_view(), name='template_detail'),
    path('templates/categories/', CategoryListView.as_view(), name='category_list'),

    # Themes
    path('themes/', ThemeListView.as_view(), name='theme_list'),

    # Dashboard
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),

    # Public invitation endpoints (no auth required)
    path('invite/<str:token>/', PublicInvitationView.as_view(), name='public_invitation'),
    path('invite/<str:token>/rsvp/', RSVPView.as_view(), name='rsvp'),

    # Router URLs
    path('', include(router.urls)),
    path('', include(invitations_router.urls)),
]
