from rest_framework import generics, permissions
from .models import Inscription
from .serializers import CreationInscriptionSerializer
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import annuler_inscription

class CreationInscriptionView(generics.ListCreateAPIView):
    serializer_class = CreationInscriptionSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Inscription.objects
            .filter(apprenant=self.request.user)
            .select_related("session")
        )

class AnnulationInscriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, inscription_id):
        try:
            inscription = annuler_inscription(
                inscription_id=inscription_id,
                apprenant=request.user,
            )
        except DjangoValidationError as erreur:
            raise serializers.ValidationError({"detail": erreur.messages})

        return Response(CreationInscriptionSerializer(inscription).data)