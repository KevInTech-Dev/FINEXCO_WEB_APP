from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import Utilisateur


class CreationCompteSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Utilisateur
        fields = ("id", "nom", "prenoms", "email", "telephone", "password")
        read_only_fields = ("id",)

        # On vérifie le mot de passe en tenant compte des informations du futur compte.
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
        utilisateur = Utilisateur(**validated_data)
        utilisateur.role = Utilisateur.Role.APPRENANT
        utilisateur.set_password(password)
        utilisateur.save()
        return utilisateur
    
class ProfilUtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ("id", "nom", "prenoms", "email", "telephone", "role")

        # Le profil est consultable par l'API, mais aucun de ses champs n'est modifiable ici.
        read_only_fields = fields