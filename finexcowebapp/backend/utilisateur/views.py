from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import (
    ChangementMotDePasseInitialSerializer,
    CreationCompteSerializer,
    ProfilUtilisateurSerializer,
)
from .models import Utilisateur
from .permission import ChangementMotDePasseRequis


class CreationCompteView(generics.CreateAPIView):
    queryset = Utilisateur.objects.all()
    serializer_class = CreationCompteSerializer

    permission_classes = [permissions.AllowAny]

class MonProfilView(generics.RetrieveAPIView):
    serializer_class = ProfilUtilisateurSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangementMotDePasseInitialView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        ChangementMotDePasseRequis,
    ]

    def post(self, request):
        serializer = ChangementMotDePasseInitialSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        utilisateur = serializer.save()
        return Response(ProfilUtilisateurSerializer(utilisateur).data)