from rest_framework import generics, permissions

from .selectors import sessions_publiques_de_formation
from .serializers import SessionCatalogueSerializer


class SessionsPubliquesFormationView(generics.ListAPIView):
    serializer_class = SessionCatalogueSerializer

    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return sessions_publiques_de_formation(
            formation_id=self.kwargs["formation_id"]
        )