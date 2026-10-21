from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import Utilisateur


class CreationCompteSerializer(serializers.ModelSerializer):
    # Le mot de passe est accepté à la création, mais jamais renvoyé dans la réponse API.
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Utilisateur
        fields = ("id", "nom", "prenoms", "email", "telephone", "password")
        read_only_fields = ("id",)

    # Les règles de mot de passe configurées dans Django.
    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as erreur:
            raise serializers.ValidationError(erreur.messages)

        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        utilisateur = Utilisateur(**validated_data)
        utilisateur.role = Utilisateur.Role.APPRENANT
        utilisateur.set_password(password)
        utilisateur.save()
        return utilisateur