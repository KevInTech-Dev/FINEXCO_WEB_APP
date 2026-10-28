from rest_framework import generics, permissions
from .selectors import sessions_publiques
from .serializers import (
    FormateurAdminSerializer,
    SessionAdminSerializer,
    SessionCreationSerializer,
    SessionPubliqueSerializer,
)
from .models import SessionFormation
from utilisateur.models import Utilisateur
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


class FormateurAdminListView(generics.ListAPIView):
    serializer_class = FormateurAdminSerializer
    permission_classes = [EstAdministrateur]

    def get_queryset(self):
        return Utilisateur.objects.filter(
            role=Utilisateur.Role.FORMATEUR,
        ).order_by("nom", "prenoms", "id")


class SessionAdminListView(generics.ListAPIView):
    serializer_class = SessionAdminSerializer
    permission_classes = [EstAdministrateur]

    def get_queryset(self):
        return SessionFormation.objects.select_related(
            "formation",
            "formateur",
        ).order_by("-date_debut", "formation__nom")