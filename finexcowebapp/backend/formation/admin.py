from django.contrib import admin

from .models import Categorie, Formation


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ("nom",)
    search_fields = ("nom", "description")


@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
    list_display = ("nom", "categorie", "duree", "etat_publication")
    list_filter = ("etat_publication", "categorie")
    search_fields = ("nom", "description", "categorie__nom")