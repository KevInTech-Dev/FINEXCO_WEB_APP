from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import Inscription
from .services import creer_inscription


class CreationInscriptionSerializer(serializers.ModelSerializer):
    # L'apprenant fournit l'identifiant de la session.
    session_id = serializers.UUIDField(write_only=True)

    # La réponse renvoie l'identifiant de la session, sans permettre de le modifier.
    session = serializers.UUIDField(source="session_id", read_only=True)

    class Meta:
        model = Inscription
        fields = (
            "id",
            "session_id",
            "session",
            "date_inscription",
            "date_limite_paiement",
            "statut",
        )
        read_only_fields = (
            "id",
            "session",
            "date_inscription",
            "date_limite_paiement",
            "statut",
        )

    # On laisse le service métier créer l'inscription et vérifier les règles.
    def create(self, validated_data):
        try:
            return creer_inscription(
                apprenant=self.context["request"].user,
                session_id=validated_data["session_id"],
            )
        except DjangoValidationError as erreur:
            raise serializers.ValidationError({"detail": erreur.messages})