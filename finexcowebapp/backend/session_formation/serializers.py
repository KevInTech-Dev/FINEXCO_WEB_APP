from rest_framework import serializers

from .models import SessionFormation


class SessionCatalogueSerializer(serializers.ModelSerializer):
    formation_nom = serializers.CharField(source="formation.nom", read_only=True)

    class Meta:
        model = SessionFormation
        fields = (
            "id",
            "formation_nom",
            "date_debut",
            "date_fin",
            "lieu",
            "prix",
            "place_total",
        )
        read_only_fields = fields