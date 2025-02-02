from django.urls import path
from .views import RegisterView, LoginView, ProfileView, UserDetailView, UserListView, BlockUnblockUserView, AdminLoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),

    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('admin/users/', UserListView.as_view(), name='user-list'),
    path('admin/users/<int:pk>/',UserDetailView.as_view(),name='user-detail'),
    path('admin/users/<int:pk>/block-unblock', BlockUnblockUserView.as_view(), name='block-unblock-user'),
]
