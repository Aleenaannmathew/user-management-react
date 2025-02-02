from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status,generics
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from django.contrib.sessions.models import Session
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import RegisterSerializer, UserSerializer


class UserListView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.exclude(is_superuser=True)
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save()

class UserCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class BlockUnblockUserView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)   
            user.is_active = not user.is_active
            user.save()
            return Response({"status":"status","is_blocked":user.is_blocked},status=status.HTTP_200_OK) 
        except CustomUser.DoesNotExist:
            return Response({"error":"User not found"}, status=status.HTTP_404_NOT_FOUND)



class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)  # Log the errors for debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = CustomUser.objects.filter(username=username).first()
        if user and user.check_password(password):
            if user.is_blocked:
                return Response({'error': "user is blocked"}, status=status.HTTP_403_FORBIDDEN)  
            
            if user.is_superuser:
                self.invalidate_previous_sessions(user)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }) 
        return Response({"error":"Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED) 
    
    def invalidate_previous_sessions(self, user):
        sessions = Session.objects.filter(expire_date__gt=timezone.now())  # Get non-expired sessions
        for session in sessions:
            session_data = session.get_decoded()
            if session_data.get('_auth_user_id') == str(user.id):
                session.delete()  

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)    

    def patch(self, request):
        user = request.user
        if 'profile_image' in request.FILES:
            user.profile_image = request.FILES['profile_image']
            user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)   


@method_decorator(csrf_exempt, name='dispatch')
class AdminLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = CustomUser.objects.filter(username=username).first()

        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.check_password(password):
            
            if user.is_superuser:  
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': {
                        'username': user.username,
                        'is_superuser': user.is_superuser,
                    }
                })
            else:
                return Response({"error": "Only admin users can log in to the admin panel"}, status=status.HTTP_403_FORBIDDEN)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)



