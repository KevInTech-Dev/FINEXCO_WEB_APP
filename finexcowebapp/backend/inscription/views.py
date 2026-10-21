from rest_framework import generics, permissions

from .models import Utilisateur
from .serializers import CreationCompteSerializer


class CreationCompteView(generics.CreateAPIView):
    queryset = Utilisateur.objects.all()
    serializer_class = CreationCompteSerializer

    permission_classes = [permissions.AllowAny]