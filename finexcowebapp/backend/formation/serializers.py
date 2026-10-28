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

class FormationAdminSerializer(serializers.ModelSerializer):
    categorie = serializers.PrimaryKeyRelatedField(
        queryset=Categorie.objects.all()
    )

    categorie_nom = serializers.CharField(source="Categorie.nom", read_only=True)

    class Meta:
        model = Formation

        fields = (
            "id",
            "nom",
            "description",
            "categorie",
            "categorie_nom",
            "etat_publication",
            "created_at",
            "updated_at",
        )

        read_only_fields = ("id", "categorie_nom", "created_at", "updated_at")