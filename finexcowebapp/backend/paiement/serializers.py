from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import Paiement
from .services import soumettre_paiement

class SoumissionPaiementSerializer(serializers.Serializer):
      inscription_id = serializers.UUIDField(write_only=True)
      mode = serializers.ChoiceField(choices=Paiement.Mode.choices)

      preuve_paiement = serializers.FileField()

      id = serializers.UUIDField(read_only=True)
      montant = serializers.DecimalField(max_digits=10, decimal_places=0, read_only=True)
      statut = serializers.ChoiceField(choices=Paiement.Statut.choices, read_only=True)

      def create(self, validated_data):
            try:
                  return soumettre_paiement(
                        apprenant=self.context["request"].user,
                        inscription_id=validated_data["inscription_id"],
                        mode=validated_data["mode"],
                        preuve_paiement=validated_data["preuve_paiement"],
                  )
            except DjangoValidationError as erreur:
                  raise serializers.ValidationError({"detail": erreur.message})

class PaiementTraitementSerializer(serializers.ModelSerializer):
      class Meta:
            model = Paiement
            fields = (
                "id",
                "inscription",
                "montant",
                "mode",
                "preuve_paiement",
                "statut",
                "motif_refus",
                "traite_par",
                "date_traitement",
            )
            read_only_fields = fields

class MotifRefusSerializer(serializers.Serializer):
      motif = serializers.CharField()