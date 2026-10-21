from rest_framework import serializers

from .models import Categorie, Formation


class CategorieCatalogueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ("id", "nom", "description")
        read_only_fields = fields


class FormationCatalogueSerializer(serializers.ModelSerializer):
    categorie = CategorieCatalogueSerializer(read_only=True)

    class Meta:
        model = Formation
        fields = ("id", "nom", "description", "duree", "categorie")
        read_only_fields = fields