from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from inscription.models import Inscription
from .models import Paiement
from .services import soumettre_paiement
from session_formation.serializers import SessionPubliqueSerializer
from utilisateur.serializers import ProfilUtilisateurSerializer

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

class InscriptionPaiementAdminSerializer(serializers.ModelSerializer):
      apprenant = ProfilUtilisateurSerializer(read_only=True)
      session = SessionPubliqueSerializer(read_only=True)

      class Meta:
            model = Inscription

            fields = (
                  "id",
                  "apprenant",
                  "session",
                  "date_inscription",
                  "date_limite_paiement",
                  "statut",
            )

            read_only_fields = fields

class PaiementAdminSerializer(serializers.ModelSerializer):
      inscription = InscriptionPaiementAdminSerializer(read_only=True)

      traite_par = ProfilUtilisateurSerializer(read_only=True)
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
                  "created_at",
                  "updated_at",
            )

            read_only_fields = fields

class InscriptionHistoriquePaiementSerializer(serializers.ModelSerializer):
    session = SessionPubliqueSerializer(read_only=True)

    class Meta:
        model = Inscription

        fields = (
            "id",
            "session",
            "date_inscription",
            "date_limite_paiement",
            "statut",
        )

        read_only_fields = fields


class HistoriquePaiementSerializer(serializers.ModelSerializer):
    inscription = InscriptionHistoriquePaiementSerializer(read_only=True)

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
            "date_traitement",
            "created_at",
        )

        read_only_fields = fields