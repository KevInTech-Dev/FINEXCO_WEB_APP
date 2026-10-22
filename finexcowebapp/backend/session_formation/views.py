from rest_framework import generics, permissions
from .selectors import sessions_publiques
from .serializers import SessionPubliqueSerializer

class SessionPubliqueListView(generics.ListAPIView):
    serializer_class = SessionPubliqueSerializer
    permission_class = [permissions.AllowAny]

    def get_queryset(self):
        return sessions_publiques(
            formation_id=self.kwargs["formation_id"],
        )