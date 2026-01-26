from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    RegisterView,
    ProfileView,
    ChangePasswordView,
    UserTierView,
    LogoutView
)

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User profile
    path('me/', ProfileView.as_view(), name='profile'),
    path('me/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('me/tier/', UserTierView.as_view(), name='user_tier'),
]
