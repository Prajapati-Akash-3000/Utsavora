from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, UserProfile, ManagerProfile, BankDetails, ManagerAvailability

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(required=True)
    mobile = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'mobile']
        
    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            mobile=validated_data.get('mobile', ''),
            role='USER'
        )

class ManagerRegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    city = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'city']

    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        city = validated_data.pop('city')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=full_name,
            role='MANAGER'
        )
        # Create Manager Profile
        ManagerProfile.objects.create(user=user, city=city, company_name="") 
        return user

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
        # Add extra responses to the JSON
        data['role'] = self.user.role
        data['email'] = self.user.email
        data['full_name'] = self.user.full_name
        return data

class ManagerProfileSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    status = serializers.CharField(source='user.manager_status', read_only=True)
    
    class Meta:
        model = ManagerProfile
        fields = ['id', 'user_email', 'full_name', 'city', 'status', 'company_name']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'is_active', 'manager_status', 'created_at']

class BankDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankDetails
        fields = ['account_holder_name', 'account_number', 'ifsc_code', 'bank_name']

class ManagerUpdateSerializer(serializers.ModelSerializer):
    bank_details = BankDetailsSerializer(required=False)

    class Meta:
        model = ManagerProfile
        fields = ['company_name', 'city', 'certificate', 'bank_details']

    def update(self, instance, validated_data):
        bank_data = validated_data.pop('bank_details', None)
        # Update profile fields
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
        fields = ['id', 'date', 'reason']

    def validate_date(self, value):
        user = self.context['request'].user

        if ManagerAvailability.objects.filter(
            manager=user,
            date=value
        ).exists():
            raise serializers.ValidationError(
                "This date is already blocked."
            )

        return value
