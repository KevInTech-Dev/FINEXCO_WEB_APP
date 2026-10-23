from rest_framework import serializers

from .models import Categorie, Formation


# Les informations de catégorie incluses dans la réponse API.
class CategoriePubliqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ("id", "nom", "description")
        read_only_fields = fields


# Voici les informations visibles pour chaque formation publiée.
class FormationPubliqueSerializer(serializers.ModelSerializer):
    categorie = CategoriePubliqueSerializer(read_only=True)

    class Meta:
        model = Formation
        fields = (
            "id",
            "nom",
            "description",
            "categorie",
        )
        read_only_fields = fields