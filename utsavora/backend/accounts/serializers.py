from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, EmailOTP, ManagerProfile, BankDetails, ManagerAvailability
from .validators import validate_full_name, validate_mobile

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(required=True)
    mobile = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        # Profile picture uploads are intentionally NOT supported during registration.
        fields = ['email', 'password', 'full_name', 'mobile']
        
    def create(self, validated_data):
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        full_name = validated_data.pop('full_name')
        mobile = validated_data.pop('mobile', '')
        
        user = User.objects.create_user(
            email=email,
            password=password,
            role='USER'
        )
        user.full_name = full_name
        user.mobile = mobile
        user.save()
        return user

class ManagerRegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = ManagerProfile
        fields = ['email', 'password', 'full_name', 'company_name']

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        company_name = validated_data.pop('company_name', '')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='MANAGER'
        )
        manager = ManagerProfile.objects.create(
            user=user,
            company_name=company_name,
            manager_status='PENDING'
        )
        user.full_name = full_name
        user.save()
        
        return manager

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['email'] = user.email
        token['full_name'] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        # Determine name and profile data based on role
        full_name = user.full_name or "User"
        if user.role == 'MANAGER' and hasattr(user, 'manager_profile'):
            full_name = user.manager_profile.company_name or full_name

        data['role'] = user.role
        data['email'] = user.email
        data['full_name'] = full_name
        
        data['user'] = {
            'id': user.id,
            'full_name': full_name,
            'email': user.email,
            'role': user.role,
        }
        return data

class ManagerProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    status = serializers.CharField(source='manager_status', read_only=True)
    
    class Meta:
        model = ManagerProfile
        fields = [
            'id', 'user_email', 'status', 'company_name'
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'created_at']

class BankDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankDetails
        fields = ['account_holder_name', 'account_number', 'ifsc_code', 'bank_name']

class ManagerUpdateSerializer(serializers.ModelSerializer):
    bank_details = BankDetailsSerializer(required=False)

    class Meta:
        model = ManagerProfile
        fields = [
            'company_name', 'certificate', 'bank_details'
        ]

    def update(self, instance, validated_data):
        bank_data = validated_data.pop('bank_details', None)
        # Update fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or Create Bank Details
        if bank_data:
            BankDetails.objects.update_or_create(manager=instance, defaults=bank_data)
            instance.bank_added = True
            instance.save()
        
        return instance

class ManagerAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = ManagerAvailability
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "mobile", "role"]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["full_name", "mobile"]

    def validate_full_name(self, value):
        errors = validate_full_name(value)
        if errors:
            raise serializers.ValidationError(errors)
        return value

    def validate_mobile(self, value):
        # Mobile is optional
        if value is None or (isinstance(value, str) and not value.strip()):
            return None
        errors = validate_mobile(value)
        if errors:
            raise serializers.ValidationError(errors)
        return value
