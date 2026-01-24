from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Event
from .serializers import EventSerializer

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_event(request):
    serializer = EventSerializer(data=request.data, context={"request": request})
    if serializer.is_valid():
        serializer.save(status="ACTIVE")
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_events(request):
    events = Event.objects.filter(user=request.user)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)
