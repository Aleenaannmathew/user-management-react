from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(use_url=True
                                           )
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_blocked','profile_image']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'profile_image']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
