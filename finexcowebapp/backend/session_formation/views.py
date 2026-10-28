from rest_framework import generics, permissions
from .selectors import sessions_publiques
from .serializers import SessionPubliqueSerializer
from rest_framework.permissions import BasePermission
from .serializers import SessionCreationSerializer
from utilisateur.permission import EstAdministrateur

class SessionPubliqueListView(generics.ListAPIView):
    serializer_class = SessionPubliqueSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return sessions_publiques(
            formation_id=self.kwargs["formation_id"],
        )

class SessionCreationView(generics.CreateAPIView):
    serializer_class = SessionCreationSerializer
    permission_classes = [EstAdministrateur]