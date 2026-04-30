from django.urls import path
from .views import LoginView, LogoutView, MeView, StaffListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('staff/', StaffListView.as_view(), name='auth-staff'),
]
