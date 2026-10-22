from rest_framework import serializers
from formation.serializers import FormationPubliqueSerializer
from .models import SessionFormation

class FormateurPublicSerializer(serializers.Serializer):
    nom_complet = serializers.SerializerMethodField()

    # L'objet reçu ici est l'utilisateur formateur associé à la session.
    def get_nom_complet(self, formateur):
        return f"{formateur.prenoms} {formateur.nom}"

class SessionPubliqueSerializer(serializers.ModelSerializer):
    formation = FormationPubliqueSerializer(read_only=True)
    formateur = FormateurPublicSerializer(read_only=True)
    duree_jours = serializers.IntegerField(read_only=True)

    class Meta:
        model = SessionFormation
        fields = (
            "id",
            "formation",
            "formateur",
            "date_debut",
            "date_fin",
            "duree_jours",
            "lieu",
            "prix",
            "place_total",
        )
        read_only_fields = fields