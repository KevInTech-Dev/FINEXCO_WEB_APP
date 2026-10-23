from rest_framework import generics, permissions
from .models import Inscription
from .serializers import CreationInscriptionSerializer


class CreationInscriptionView(generics.ListCreateAPIView):
    serializer_class = CreationInscriptionSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Inscription.objects
            .filter(apprenant=self.request.user)
            .select_related("session")
        )