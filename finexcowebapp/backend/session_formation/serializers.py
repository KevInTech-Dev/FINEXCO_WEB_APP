from rest_framework import serializers
from formation.serializers import FormationPubliqueSerializer
from .models import SessionFormation
from formation.models import Formation
from utilisateur.models import Utilisateur

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

class SessionCreationSerializer(serializers.ModelSerializer):
    formation = serializers.PrimaryKeyRelatedField(
        queryset=Formation.objects.all(),
    )

    formateur = serializers.PrimaryKeyRelatedField(
        queryset=Utilisateur.objects.filter(role=Utilisateur.Role.FORMATEUR),
    )

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
            "place_total"
        )

        read_only_fields = ("id", "duree_jours")

    # def validate(self, donnees):
    #     date_debut = donnees.get("date_debut")
    #     date_fin = donnees.get("date_fin")

    #     if date_debut and date_fin and date_fin < date_debut:
    #         raise serializers.ValidationError({
    #             "date_fin": "La date de fin doit être égale ou postérieure à la date de début."
    #         })

    #     return donnees