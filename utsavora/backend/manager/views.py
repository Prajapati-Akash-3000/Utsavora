from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ManagerBlockedDate
from .serializers import BlockedDateSerializer

class IsManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'MANAGER'

class ManagerBlockedDateListCreateView(generics.ListCreateAPIView):
    serializer_class = BlockedDateSerializer
    permission_classes = [IsManager]

    def get_queryset(self):
        if hasattr(self.request.user, 'managerprofile'):
            return ManagerBlockedDate.objects.filter(manager=self.request.user.managerprofile)
        return ManagerBlockedDate.objects.none()

class CalendarView(APIView):
    permission_classes = [IsManager]

    def get(self, request):
        # 1. Blocked Dates
        blocked_qs = ManagerBlockedDate.objects.filter(manager=request.user.managerprofile)
        blocked_data = []
        for b in blocked_qs:
            blocked_data.append({
                "id": b.id,
                "date": b.date,
                "type": "BLOCKED"
            })

        # 2. Confirmed Bookings
        from bookings.models import Booking
        bookings_qs = Booking.objects.filter(
            manager=request.user,
            status="CONFIRMED"
        ).select_related('event')
        
        booked_data = []
        for b in bookings_qs:
            booked_data.append({
                "id": b.id,
                "date": b.event.event_date,
                "type": "BOOKED",
                "title": b.event.title
            })

        return Response({
            "blocked": blocked_data,
            "booked": booked_data
        })

class UnblockDateView(APIView):
    permission_classes = [IsManager]

    def delete(self, request, pk):
        try:
            blocked_date = ManagerBlockedDate.objects.get(pk=pk, manager=request.user.managerprofile)
            blocked_date.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ManagerBlockedDate.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
