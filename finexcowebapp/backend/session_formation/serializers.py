from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from formation.serializers import FormationPubliqueSerializer
from .models import SessionFormation
from formation.models import Formation
from utilisateur.models import Utilisateur

class FormateurPublicSerializer(serializers.Serializer):
    nom_complet = serializers.SerializerMethodField()

    # L'objet reçu ici est l'utilisateur formateur associé à la session.
    def get_nom_complet(self, formateur):
        return f"{formateur.nom} {formateur.prenoms}"


class FormateurAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ("id", "nom", "prenoms", "email")
        read_only_fields = fields


class CreationFormateurAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Utilisateur
        fields = ("id", "nom", "prenoms", "email", "telephone", "password")
        read_only_fields = ("id",)

    def validate(self, attrs):
        candidat = Utilisateur(
            nom=attrs["nom"],
            prenoms=attrs["prenoms"],
            email=attrs["email"],
            telephone=attrs["telephone"],
        )
        try:
            validate_password(attrs["password"], user=candidat)
        except DjangoValidationError as erreur:
            raise serializers.ValidationError({"password": erreur.messages})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        return Utilisateur.objects.create_user(
            **validated_data,
            password=password,
            role=Utilisateur.Role.FORMATEUR,
            doit_changer_mot_de_passe=True,
        )


class FormationAdminResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formation
        fields = ("id", "nom")
        read_only_fields = fields


class SessionAdminSerializer(serializers.ModelSerializer):
    formation = FormationAdminResumeSerializer(read_only=True)
    formateur = FormateurAdminSerializer(read_only=True)
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
            "image",
            "etat",
            "created_at",
        )
        read_only_fields = fields


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
            "image",
            "place_total",
            "created_at",
            "updated_at",
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
            "place_total",
            "image",
        )

        read_only_fields = ("id", "duree_jours")

    def validate(self, donnees):
        date_debut = donnees.get("date_debut")
        date_fin = donnees.get("date_fin")

        if date_debut and date_fin and date_fin < date_debut:
            raise serializers.ValidationError({
                "date_fin": "La date de fin doit être égale ou postérieure à la date de début."
            })

        return donnees


class SessionAdminModificationSerializer(SessionCreationSerializer):
    class Meta(SessionCreationSerializer.Meta):
        fields = SessionCreationSerializer.Meta.fields + ("etat",)