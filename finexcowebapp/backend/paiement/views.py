from rest_framework import generics, permissions
from .serializers import SoumissionPaiementSerializer

from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from utilisateur.permission import EstAdministrateur
from .models import Paiement
from .serializers import (
    MotifRefusSerializer,
    PaiementTraitementSerializer,
)
from .services import valider_paiement, refuser_paiement


class SoumissionPaiementView(generics.CreateAPIView):
    serializer_class = SoumissionPaiementSerializer
    permission_classes = [permissions.IsAuthenticated]

class ValidationPaiementView(APIView):
    permission_classes = [EstAdministrateur]

    def post(self, request, paiement_id):
        try:
            paiement = valider_paiement(
                paiement_id=paiement_id,
                administrateur=request.user,
            )
        except DjangoValidationError as erreur:
            raise serializers.ValidationError({"detail": erreur.messages})

        return Response(PaiementTraitementSerializer(
            paiement, context={"request": request}
        ).data)
    
#Refus de paiement avec Motif
class RefusPaiementView(APIView):
    permission_classes = [EstAdministrateur]

    def post(self, request, paiement_id):
        motif_serializer = MotifRefusSerializer(data=request.data)
        motif_serializer.is_valid(raise_exception=True)

        try:
            paiement = refuser_paiement(
                paiement_id=paiement_id,
                administrateur=request.user,
                motif=motif_serializer.validated_data["data"],
            )
        except DjangoValidationError as erreur:
            raise serializers.ValidationError({"detail": erreur.messages})

        return Response(PaiementTraitementSerializer(
            paiement, context={"request": request}
        ).data)
        