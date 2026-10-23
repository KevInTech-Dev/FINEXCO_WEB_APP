from rest_framework import generics, permissions
from .serializers import CreationCompteSerializer, ProfilUtilisateurSerializer
from .models import Utilisateur


class CreationCompteView(generics.CreateAPIView):
    queryset = Utilisateur.objects.all()
    serializer_class = CreationCompteSerializer

    permission_classes = [permissions.AllowAny]

class MonProfilView(generics.RetrieveAPIView):
    serializer_class = ProfilUtilisateurSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user